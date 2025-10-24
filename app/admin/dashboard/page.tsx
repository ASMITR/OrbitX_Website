'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Calendar, FolderOpen, Users, MessageSquare, Plus, TrendingUp, Eye, BookOpen, Crown } from 'lucide-react'
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
    messages: 0
  })
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

        setStats({
          events: events.length,
          projects: projects.length,
          members: members.length,
          messages: messages.length
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
        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
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

        {/* Site Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="glass-card-admin p-6"
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <Eye className="h-5 w-5 mr-2" />
            Site Overview
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-2">Active</div>
              <p className="text-gray-400">Website Status</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-2">
                {stats.events + stats.projects}
              </div>
              <p className="text-gray-400">Total Content</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400 mb-2">
                {stats.members}
              </div>
              <p className="text-gray-400">Team Size</p>
            </div>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  )
}