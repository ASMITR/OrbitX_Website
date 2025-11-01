'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Calendar, FolderOpen, Users, MessageSquare, Plus, TrendingUp, Eye, BookOpen, Crown, Package, ChevronRight } from 'lucide-react'
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
    blogs: 0,
    merchandise: 0
  })
  const [teamStats, setTeamStats] = useState<{[key: string]: number}>({})
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [dataLoading, setDataLoading] = useState(true)


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

        // Get merchandise
        const merchandiseResponse = await fetch('/api/merchandise')
        const merchandise = merchandiseResponse.ok ? await merchandiseResponse.json() : []

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
          blogs: blogs.length,
          merchandise: merchandise.length
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
      title: 'Merchandise',
      value: stats.merchandise,
      icon: Package,
      color: 'from-orange-500 to-orange-600',
      href: '/admin/merchandise'
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
      color: 'from-red-500 to-red-600',
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
      title: 'Add Merchandise',
      description: 'Add new merchandise item',
      icon: Package,
      href: '/admin/merchandise/new',
      color: 'from-orange-500 to-orange-600'
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass-card-admin p-4 sm:p-6"
          >
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center">
              <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {quickActions.map((action, index) => (
                <Link key={action.title} href={action.href}>
                  <motion.div 
                    className="relative p-4 sm:p-5 bg-gradient-to-br from-white/10 to-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 group cursor-pointer overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.03, y: -3 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {/* Background gradient effect */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                      whileHover={{ opacity: 0.15 }}
                    />
                    
                    {/* Shimmer effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                    />
                    
                    <div className="relative z-10 flex items-start space-x-4">
                      <motion.div 
                        className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <action.icon className="h-6 w-6 text-white" />
                      </motion.div>
                      
                      <div className="flex-1 min-w-0">
                        <motion.h4 
                          className="text-white font-bold text-sm sm:text-base mb-1 group-hover:text-white transition-colors"
                          whileHover={{ x: 2 }}
                        >
                          {action.title}
                        </motion.h4>
                        <motion.p 
                          className="text-gray-400 text-xs sm:text-sm leading-relaxed group-hover:text-gray-300 transition-colors"
                          whileHover={{ x: 2 }}
                        >
                          {action.description}
                        </motion.p>
                      </div>
                      
                      {/* Arrow indicator */}
                      <motion.div
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        whileHover={{ x: 2 }}
                      >
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </motion.div>
                    </div>
                    
                    {/* Bottom glow effect */}
                    <motion.div
                      className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${action.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                      whileHover={{ scaleX: 1.05 }}
                    />
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="glass-card-admin p-4 sm:p-6"
          >
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Recent Activity
            </h3>
            <div className="space-y-3 sm:space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-center p-2 sm:p-3 bg-white/10 rounded-lg hover:bg-white/15 transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <motion.div 
                      className="w-6 h-6 sm:w-8 sm:h-8 bg-white/10 rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0"
                      whileHover={{ scale: 1.1 }}
                    >
                      <activity.icon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs sm:text-sm font-medium truncate">{activity.title}</p>
                      <p className="text-gray-400 text-xs">
                        {new Date(activity.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          ...(window.innerWidth > 640 && { year: 'numeric' })
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-gray-400 text-sm sm:text-base"
                  >
                    <TrendingUp className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 opacity-50" />
                    <p>No recent activity</p>
                  </motion.div>
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
                    <span className="text-gray-400 text-sm">({stats.events + stats.projects + stats.blogs + stats.merchandise > 0 ? Math.round((stats.events / (stats.events + stats.projects + stats.blogs + stats.merchandise)) * 100) : 0}%)</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-purple-400 rounded-full mr-3"></div>
                    <span className="text-gray-300">Projects</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-white font-medium mr-2">{stats.projects}</span>
                    <span className="text-gray-400 text-sm">({stats.events + stats.projects + stats.blogs + stats.merchandise > 0 ? Math.round((stats.projects / (stats.events + stats.projects + stats.blogs + stats.merchandise)) * 100) : 0}%)</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-orange-400 rounded-full mr-3"></div>
                    <span className="text-gray-300">Blogs</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-white font-medium mr-2">{stats.blogs}</span>
                    <span className="text-gray-400 text-sm">({stats.events + stats.projects + stats.blogs + stats.merchandise > 0 ? Math.round((stats.blogs / (stats.events + stats.projects + stats.blogs + stats.merchandise)) * 100) : 0}%)</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full mr-3"></div>
                    <span className="text-gray-300">Merchandise</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-white font-medium mr-2">{stats.merchandise}</span>
                    <span className="text-gray-400 text-sm">({stats.events + stats.projects + stats.blogs + stats.merchandise > 0 ? Math.round((stats.merchandise / (stats.events + stats.projects + stats.blogs + stats.merchandise)) * 100) : 0}%)</span>
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
                <div className="text-2xl font-bold text-green-400 mb-2">{stats.events + stats.projects + stats.blogs + stats.merchandise}</div>
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