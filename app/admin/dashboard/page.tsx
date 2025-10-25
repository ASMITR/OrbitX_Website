'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Calendar, FolderOpen, Users, MessageSquare, Plus, TrendingUp, Eye, BookOpen, Crown, Edit3, Save, X, Github, Linkedin, Instagram, Camera, Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import AdminLayout from '@/components/admin/AdminLayout'
import { getEvents, getProjects, getMembers, getContactMessages } from '@/lib/db'
import { useAuth } from '@/components/admin/AuthProvider'
import { isOwnerDB, isAdminDB } from '@/lib/roles'
import { useRouter } from 'next/navigation'
import { Event, Project, Member, ContactMessage } from '@/lib/types'

export default function AdminDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isOwnerUser, setIsOwnerUser] = useState(false)
  const [stats, setStats] = useState({
    events: 0,
    projects: 0,
    members: 0,
    messages: 0,
    blogs: 0
  })
  const [teamStats, setTeamStats] = useState<{[key: string]: number}>({})
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [editingProfile, setEditingProfile] = useState(false)
  const [adminProfile, setAdminProfile] = useState<any>(null)
  const [profileData, setProfileData] = useState({
    name: '',
    photo: '',
    linkedin: '',
    github: '',
    instagram: ''
  })
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string>('')
  const [savingProfile, setSavingProfile] = useState(false)

  useEffect(() => {
    const checkUserRole = async () => {
      if (user) {
        const ownerStatus = await isOwnerDB(user)
        const adminStatus = await isAdminDB(user)
        
        setIsOwnerUser(ownerStatus)
        
        if (!adminStatus) {
          router.push('/member')
        }
      } else {
        router.push('/auth')
      }
    }
    
    if (!loading) {
      checkUserRole()
    }
  }, [user, loading, router])

  // Fetch admin profile
  useEffect(() => {
    const fetchAdminProfile = async () => {
      if (user) {
        try {
          const response = await fetch(`/api/admin/profile/${user.uid}`)
          if (response.ok) {
            const profile = await response.json()
            setAdminProfile(profile)
            setProfileData({
              name: profile?.name || '',
              photo: profile?.photo || '',
              linkedin: profile?.socialLinks?.linkedin || '',
              github: profile?.socialLinks?.github || '',
              instagram: profile?.socialLinks?.instagram || ''
            })
          } else {
            // Try to get member data as fallback
            const { getMember, getMemberByEmail } = await import('@/lib/db')
            let member = await getMember(user.uid)
            if (!member) {
              member = await getMemberByEmail(user.email!)
            }
            if (member) {
              setAdminProfile(member)
              setProfileData({
                name: member.name || '',
                photo: member.photo || '',
                linkedin: member.socialLinks?.linkedin || '',
                github: member.socialLinks?.github || '',
                instagram: member.socialLinks?.instagram || ''
              })
            }
          }
        } catch (error) {
          console.error('Error fetching admin profile:', error)
        }
      }
    }
    fetchAdminProfile()
  }, [user])

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Photo size must be less than 5MB')
        return
      }
      setPhotoFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPhotoPreview(result)
        setProfileData({ ...profileData, photo: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const saveProfile = async () => {
    if (!user) {
      toast.error('User not authenticated')
      return
    }
    
    if (!profileData.name.trim()) {
      toast.error('Name is required')
      return
    }
    
    setSavingProfile(true)
    
    try {
      const updateData = {
        name: profileData.name.trim(),
        photo: profileData.photo,
        email: user.email,
        socialLinks: {
          linkedin: profileData.linkedin.trim(),
          github: profileData.github.trim(),
          instagram: profileData.instagram.trim()
        }
      }
      
      console.log('Saving profile data:', updateData)
      
      // Try to update admin profile first
      const response = await fetch(`/api/admin/profile/${user.uid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      })
      
      console.log('API response status:', response.status)
      
      if (response.ok) {
        const result = await response.json()
        console.log('API response:', result)
        setAdminProfile({ ...adminProfile, ...updateData })
        setEditingProfile(false)
        setPhotoPreview('')
        toast.success('Profile updated successfully!')
        window.dispatchEvent(new CustomEvent('profile-updated'))
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('API error:', errorData)
        
        // Fallback to member profile update
        console.log('Trying member profile fallback...')
        const { updateMemberProfile, getMember, getMemberByEmail } = await import('@/lib/db')
        let member = await getMember(user.uid)
        if (!member && user.email) {
          member = await getMemberByEmail(user.email)
        }
        if (member) {
          console.log('Updating member profile:', member.id)
          await updateMemberProfile(member.id, updateData)
          setAdminProfile({ ...adminProfile, ...updateData })
          setEditingProfile(false)
          setPhotoPreview('')
          toast.success('Profile updated successfully!')
          window.dispatchEvent(new CustomEvent('profile-updated'))
        } else {
          toast.error('Profile not found. Please contact administrator.')
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile. Please try again.')
    } finally {
      setSavingProfile(false)
    }
  }

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [events, projects, members, messages] = await Promise.all([
          getEvents(),
          getProjects(),
          getMembers(),
          getContactMessages()
        ])

        // Get blogs from lib/db
        const { getBlogs } = await import('@/lib/db')
        const blogs = await getBlogs()

        // Count members by team
        const teamCounts: {[key: string]: number} = {}
        members.forEach((member: Member) => {
          teamCounts[member.team] = (teamCounts[member.team] || 0) + 1
        })
        setTeamStats(teamCounts)

        setStats({
          events: events.length,
          projects: projects.length,
          members: members.length,
          messages: messages.length,
          blogs: blogs.length
        })

        // Create recent activity from all data
        const activity = [
          ...events.slice(0, 3).map((event: Event) => ({
            type: 'event',
            title: event.title,
            date: event.createdAt,
            icon: Calendar
          })),
          ...projects.slice(0, 3).map((project: Project) => ({
            type: 'project',
            title: project.title,
            date: project.createdAt,
            icon: FolderOpen
          })),
          ...messages.slice(0, 3).map((message: ContactMessage) => ({
            type: 'message',
            title: `Message from ${message.name}`,
            date: message.createdAt,
            icon: MessageSquare
          }))
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 6)

        setRecentActivity(activity)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setDataLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    )
  }

  if (!user) {
    router.push('/auth')
    return null
  }

  const statCards = [
    {
      title: 'Total Events',
      value: stats.events,
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
      href: '/admin/events'
    },
    {
      title: 'Total Projects',
      value: stats.projects,
      icon: FolderOpen,
      color: 'from-purple-500 to-purple-600',
      href: '/admin/projects'
    },
    {
      title: 'Team Members',
      value: stats.members,
      icon: Users,
      color: 'from-green-500 to-green-600',
      href: '/admin/members'
    },
    {
      title: 'Messages',
      value: stats.messages,
      icon: MessageSquare,
      color: 'from-orange-500 to-orange-600',
      href: '/admin/messages'
    }
  ]

  const quickActions = [
    {
      title: 'Add New Event',
      description: 'Create a new event or workshop',
      icon: Calendar,
      href: '/admin/events/new',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Add New Project',
      description: 'Showcase a new project',
      icon: FolderOpen,
      href: '/admin/projects/new',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'New Blog Post',
      description: 'Write and publish a new blog',
      icon: BookOpen,
      href: '/admin/blogs',
      color: 'from-cyan-500 to-cyan-600'
    },
    {
      title: 'Add Team Member',
      description: 'Add a new team member',
      icon: Users,
      href: '/admin/members/new',
      color: 'from-green-500 to-green-600'
    },
    ...(isOwnerUser ? [
      {
        title: 'Manage Admins',
        description: 'Add or remove administrators',
        icon: Crown,
        href: '/admin/manage-admins',
        color: 'from-yellow-500 to-yellow-600'
      },
      {
        title: 'Manage Members',
        description: 'Award badges, add to events & projects',
        icon: Users,
        href: '/admin/manage-members',
        color: 'from-indigo-500 to-indigo-600'
      }
    ] : [])
  ]



  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-8">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-card-admin p-6 mb-6"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-white">Admin Profile</h3>
            <button
              onClick={() => setEditingProfile(!editingProfile)}
              className="btn-primary flex items-center"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              {editingProfile ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {editingProfile ? (
            <div className="space-y-6">
              {/* Profile Photo Section */}
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <img
                      src={photoPreview || profileData.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name || user?.email?.split('@')[0] || 'Admin')}&background=3b82f6&color=ffffff&size=200`}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-blue-400/30"
                    />
                    <label className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full cursor-pointer transition-colors">
                      <Camera className="h-4 w-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 text-center">Click camera to upload</p>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                    placeholder="Enter your name"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">LinkedIn</label>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
                    <input
                      type="url"
                      value={profileData.linkedin}
                      onChange={(e) => setProfileData({ ...profileData, linkedin: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                      placeholder="LinkedIn URL"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">GitHub</label>
                  <div className="relative">
                    <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="url"
                      value={profileData.github}
                      onChange={(e) => setProfileData({ ...profileData, github: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                      placeholder="GitHub URL"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Instagram</label>
                  <div className="relative">
                    <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400 h-4 w-4" />
                    <input
                      type="url"
                      value={profileData.instagram}
                      onChange={(e) => setProfileData({ ...profileData, instagram: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                      placeholder="Instagram URL"
                    />
                  </div>
                </div>
              </div>
              <button
                onClick={saveProfile}
                disabled={savingProfile}
                className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingProfile ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Profile
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={adminProfile?.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(adminProfile?.name || user?.email?.split('@')[0] || 'Admin')}&background=3b82f6&color=ffffff&size=200`}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover border-4 border-blue-400/30"
                />
                <div>
                  <h4 className="text-lg font-semibold text-white">{adminProfile?.name || user?.email?.split('@')[0] || 'Admin'}</h4>
                  <p className="text-gray-400">{isOwnerUser ? 'Owner' : 'Administrator'}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                {adminProfile?.socialLinks?.linkedin && (
                  <a
                    href={adminProfile.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 text-blue-300 rounded-lg border border-blue-500/30 hover:bg-blue-500/30 transition-colors"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </a>
                )}
                {adminProfile?.socialLinks?.github && (
                  <a
                    href={adminProfile.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-gray-500/20 text-gray-300 rounded-lg border border-gray-500/30 hover:bg-gray-500/30 transition-colors"
                  >
                    <Github className="h-4 w-4" />
                    GitHub
                  </a>
                )}
                {adminProfile?.socialLinks?.instagram && (
                  <a
                    href={adminProfile.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-pink-500/20 text-pink-300 rounded-lg border border-pink-500/30 hover:bg-pink-500/30 transition-colors"
                  >
                    <Instagram className="h-4 w-4" />
                    Instagram
                  </a>
                )}
                {(!adminProfile?.socialLinks?.linkedin && !adminProfile?.socialLinks?.github && !adminProfile?.socialLinks?.instagram) && (
                  <p className="text-gray-400">No social media links added yet.</p>
                )}
              </div>
            </div>
          )}
        </motion.div>

        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass-card-admin p-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-400/30"
        >
          <h2 className="text-2xl font-bold text-white mb-2">Welcome to OrbitX Admin</h2>
          <p className="text-gray-300">
            Manage your space exploration organization from this central dashboard. 
            Monitor activities, add content, and keep your community engaged.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link href={stat.href}>
                <div className="admin-card p-6 group cursor-pointer hover:border-blue-400/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                      <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass-card-admin p-6"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Quick Actions
            </h3>
            <div className="space-y-4">
              {quickActions.map((action, index) => (
                <Link key={action.title} href={action.href}>
                  <div className="flex items-center p-4 bg-white/10 rounded-lg hover:bg-white/15 transition-all duration-300 group cursor-pointer hover:scale-105">
                    <div className={`w-10 h-10 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform`}>
                      <action.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{action.title}</h4>
                      <p className="text-gray-400 text-sm">{action.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="glass-card-admin p-6"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Recent Activity
            </h3>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center p-3 bg-white/10 rounded-lg hover:bg-white/15 transition-colors">
                    <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center mr-3">
                      <activity.icon className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{activity.title}</p>
                      <p className="text-gray-400 text-xs">
                        {new Date(activity.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">No recent activity</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Detailed Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="glass-card-admin p-6"
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Analytics Dashboard
          </h3>
          
          {/* Key Metrics */}
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-6 hover:bg-blue-500/30 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-300 text-sm font-medium">Team Members</p>
                  <p className="text-2xl font-bold text-white">{stats.members}</p>
                  <p className="text-blue-200 text-xs mt-1">Active team members</p>
                </div>
                <Users className="h-8 w-8 text-blue-400" />
              </div>
            </div>
            
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-6 hover:bg-green-500/30 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-300 text-sm font-medium">Total Events</p>
                  <p className="text-2xl font-bold text-white">{stats.events}</p>
                  <p className="text-green-200 text-xs mt-1">Organized activities</p>
                </div>
                <Calendar className="h-8 w-8 text-green-400" />
              </div>
            </div>
            
            <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-6 hover:bg-purple-500/30 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-300 text-sm font-medium">Total Projects</p>
                  <p className="text-2xl font-bold text-white">{stats.projects}</p>
                  <p className="text-purple-200 text-xs mt-1">Innovation initiatives</p>
                </div>
                <FolderOpen className="h-8 w-8 text-purple-400" />
              </div>
            </div>
            
            <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-6 hover:bg-orange-500/30 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-300 text-sm font-medium">Total Blogs</p>
                  <p className="text-2xl font-bold text-white">{stats.blogs}</p>
                  <p className="text-orange-200 text-xs mt-1">Published articles</p>
                </div>
                <BookOpen className="h-8 w-8 text-orange-400" />
              </div>
            </div>
            
            <div className="bg-cyan-500/20 border border-cyan-500/30 rounded-lg p-6 hover:bg-cyan-500/30 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cyan-300 text-sm font-medium">Total Content</p>
                  <p className="text-2xl font-bold text-white">{stats.events + stats.projects + stats.blogs}</p>
                  <p className="text-cyan-200 text-xs mt-1">Combined content items</p>
                </div>
                <Eye className="h-8 w-8 text-cyan-400" />
              </div>
            </div>
          </div>

          {/* Detailed Analytics */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Content Distribution */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h4 className="text-lg font-semibold text-white mb-4">Content Distribution</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                    <span className="text-gray-300">Events</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-white font-medium mr-2">{stats.events}</span>
                    <span className="text-gray-400 text-sm">({stats.events + stats.projects + stats.blogs > 0 ? Math.round((stats.events / (stats.events + stats.projects + stats.blogs)) * 100) : 0}%)</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-purple-400 rounded-full mr-3"></div>
                    <span className="text-gray-300">Projects</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-white font-medium mr-2">{stats.projects}</span>
                    <span className="text-gray-400 text-sm">({stats.events + stats.projects + stats.blogs > 0 ? Math.round((stats.projects / (stats.events + stats.projects + stats.blogs)) * 100) : 0}%)</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-orange-400 rounded-full mr-3"></div>
                    <span className="text-gray-300">Blogs</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-white font-medium mr-2">{stats.blogs}</span>
                    <span className="text-gray-400 text-sm">({stats.events + stats.projects + stats.blogs > 0 ? Math.round((stats.blogs / (stats.events + stats.projects + stats.blogs)) * 100) : 0}%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Distribution */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center justify-between">
                Team Distribution
                <span className="text-blue-400 text-sm font-normal">Total: {stats.members} members</span>
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Design & Innovation Team</span>
                  <span className="text-white font-medium">{teamStats['Design & Innovation Team'] || 0} members</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Technical Team</span>
                  <span className="text-white font-medium">{teamStats['Technical Team'] || 0} members</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Management & Operations Team</span>
                  <span className="text-white font-medium">{teamStats['Management & Operations Team'] || 0} members</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Public Outreach Team</span>
                  <span className="text-white font-medium">{teamStats['Public Outreach Team'] || 0} members</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Documentation Team</span>
                  <span className="text-white font-medium">{teamStats['Documentation Team'] || 0} members</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Social Media & Editing Team</span>
                  <span className="text-white font-medium">{teamStats['Social Media & Editing Team'] || 0} members</span>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Summary */}
          <div className="mt-6 bg-white/5 rounded-2xl p-6 border border-white/10">
            <h4 className="text-lg font-semibold text-white mb-4">Activity Summary</h4>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 mb-2">Active</div>
                <p className="text-gray-400 text-sm">Website Status</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 mb-2">{stats.events + stats.projects + stats.blogs}</div>
                <p className="text-gray-400 text-sm">Total Content Items</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400 mb-2">6</div>
                <p className="text-gray-400 text-sm">Active Teams</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  )
}