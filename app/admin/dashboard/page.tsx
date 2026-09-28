'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Calendar, FolderOpen, Users, MessageSquare, Plus, TrendingUp,
  BookOpen, Crown, Package, ShoppingCart, ArrowUpRight, Activity,
  BarChart3, Layers, Shield, Zap
} from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import { getEvents, getProjects, getMembers, getContactMessages } from '@/lib/db'
import { useAuth } from '@/components/admin/AuthProvider'
import { Event, Project, Member, ContactMessage } from '@/lib/types'

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay }
})

export default function AdminDashboard() {
  const { userRole } = useAuth()
  const isOwner = userRole === 'owner'

  const [stats, setStats] = useState({ events: 0, projects: 0, members: 0, messages: 0, blogs: 0, merchandise: 0 })
  const [teamStats, setTeamStats] = useState<{ [key: string]: number }>({})
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [dataLoading, setDataLoading] = useState(true)

  const accent = isOwner ? 'amber' : 'violet'
  const accentClass = isOwner
    ? { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', gradient: 'from-amber-500 to-orange-500' }
    : { text: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20', gradient: 'from-violet-500 to-indigo-500' }

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [events, projects, members, messages] = await Promise.all([
          getEvents(), getProjects(), getMembers(), getContactMessages()
        ])
        const { getBlogs } = await import('@/lib/db')
        const blogs = await getBlogs()
        const merchandiseRes = await fetch('/api/merchandise')
        const merchandise = merchandiseRes.ok ? await merchandiseRes.json() : []

        const teamCounts: { [key: string]: number } = {}
        members.forEach((m: Member) => { teamCounts[m.team] = (teamCounts[m.team] || 0) + 1 })
        setTeamStats(teamCounts)

        setStats({
          events: events.length, projects: projects.length, members: members.length,
          messages: messages.length, blogs: blogs.length, merchandise: merchandise.length
        })

        const activity = [
          ...events.slice(0, 3).map((e: Event) => ({ type: 'event', title: e.title, date: e.createdAt, icon: Calendar, color: 'text-blue-400', dot: 'bg-blue-400' })),
          ...projects.slice(0, 3).map((p: Project) => ({ type: 'project', title: p.title, date: p.createdAt, icon: FolderOpen, color: 'text-purple-400', dot: 'bg-purple-400' })),
          ...messages.slice(0, 3).map((m: ContactMessage) => ({ type: 'message', title: `Message from ${m.name}`, date: m.createdAt, icon: MessageSquare, color: 'text-green-400', dot: 'bg-green-400' }))
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 6)

        setRecentActivity(activity)
      } catch (e) {
        console.error(e)
      } finally {
        setDataLoading(false)
      }
    }
    fetchStats()
  }, [])

  const statCards = [
    { title: 'Events', value: stats.events, icon: Calendar, href: '/admin/events', color: 'from-blue-500 to-blue-600', light: 'bg-blue-500/10 border-blue-500/20 text-blue-400' },
    { title: 'Projects', value: stats.projects, icon: FolderOpen, href: '/admin/projects', color: 'from-purple-500 to-purple-600', light: 'bg-purple-500/10 border-purple-500/20 text-purple-400' },
    { title: 'Members', value: stats.members, icon: Users, href: '/admin/members', color: 'from-emerald-500 to-emerald-600', light: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' },
    { title: 'Messages', value: stats.messages, icon: MessageSquare, href: '/admin/messages', color: 'from-rose-500 to-rose-600', light: 'bg-rose-500/10 border-rose-500/20 text-rose-400' },
    { title: 'Merchandise', value: stats.merchandise, icon: Package, href: '/admin/merchandise', color: 'from-orange-500 to-orange-600', light: 'bg-orange-500/10 border-orange-500/20 text-orange-400' },
    { title: 'Blogs', value: stats.blogs, icon: BookOpen, href: '/admin/blogs', color: 'from-cyan-500 to-cyan-600', light: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' },
  ]

  const quickActions = [
    { title: 'New Event', icon: Calendar, href: '/admin/events/new', color: 'from-blue-500 to-blue-600' },
    { title: 'New Project', icon: FolderOpen, href: '/admin/projects/new', color: 'from-purple-500 to-purple-600' },
    { title: 'New Blog', icon: BookOpen, href: '/admin/blogs', color: 'from-cyan-500 to-cyan-600' },
    { title: 'Add Merch', icon: Package, href: '/admin/merchandise/new', color: 'from-orange-500 to-orange-600' },
    { title: 'Add Member', icon: Users, href: '/admin/members/new', color: 'from-emerald-500 to-emerald-600' },
    { title: 'View Orders', icon: ShoppingCart, href: '/admin/orders', color: 'from-rose-500 to-rose-600' },
    ...(isOwner ? [{ title: 'Manage Admins', icon: Crown, href: '/admin/manage-admins', color: 'from-amber-500 to-amber-600' }] : []),
  ]

  const total = stats.events + stats.projects + stats.blogs + stats.merchandise || 1
  const contentDist = [
    { label: 'Events', value: stats.events, color: 'bg-blue-500' },
    { label: 'Projects', value: stats.projects, color: 'bg-purple-500' },
    { label: 'Blogs', value: stats.blogs, color: 'bg-cyan-500' },
    { label: 'Merch', value: stats.merchandise, color: 'bg-orange-500' },
  ]

  const teams = [
    'Design & Innovation Team', 'Technical Team', 'Management & Operations Team',
    'Public Outreach Team', 'Documentation Team', 'Social Media & Editing Team'
  ]

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">

        {/* Header */}
        <motion.div {...fade(0)} className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {isOwner
                ? <Crown className="w-4 h-4 text-amber-400" />
                : <Shield className="w-4 h-4 text-violet-400" />
              }
              <span className={`text-xs font-medium ${accentClass.text}`}>
                {isOwner ? 'Owner Dashboard' : 'Admin Dashboard'}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white">Overview</h1>
            <p className="text-gray-500 text-sm mt-0.5">OrbitX content & community at a glance</p>
          </div>
          <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${accentClass.bg} ${accentClass.border} ${accentClass.text}`}>
            <Zap className="w-3 h-3" />
            Live
          </div>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
          {statCards.map((s, i) => (
            <motion.div key={s.title} {...fade(i * 0.05)}>
              <Link href={s.href}>
                <div className={`group p-4 rounded-2xl border bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-200 cursor-pointer ${s.light.split(' ').slice(1).join(' ')}`}>
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <s.icon className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-white">{dataLoading ? '—' : s.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.title}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Middle row */}
        <div className="grid lg:grid-cols-3 gap-4">

          {/* Quick actions */}
          <motion.div {...fade(0.2)} className="lg:col-span-2 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Plus className="w-4 h-4 text-gray-400" />
              <h2 className="text-sm font-semibold text-white">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {quickActions.map((a, i) => (
                <Link key={a.title} href={a.href}>
                  <motion.div
                    className="group flex items-center gap-3 p-3 rounded-xl border border-white/[0.06] hover:border-white/[0.12] bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-150 cursor-pointer"
                    whileHover={{ y: -1 }}
                  >
                    <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${a.color} flex items-center justify-center flex-shrink-0`}>
                      <a.icon className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-gray-400 group-hover:text-gray-200 text-xs font-medium transition-colors truncate">{a.title}</span>
                    <ArrowUpRight className="w-3 h-3 text-gray-700 group-hover:text-gray-400 ml-auto flex-shrink-0 transition-colors" />
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Activity feed */}
          <motion.div {...fade(0.25)} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-gray-400" />
              <h2 className="text-sm font-semibold text-white">Recent Activity</h2>
            </div>
            <div className="space-y-3">
              {recentActivity.length > 0 ? recentActivity.map((a, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                  className="flex items-start gap-3">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${a.dot}`} />
                  <div className="min-w-0">
                    <p className="text-gray-300 text-xs font-medium truncate">{a.title}</p>
                    <p className="text-gray-600 text-[10px] mt-0.5">
                      {new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </motion.div>
              )) : (
                <div className="text-center py-6">
                  <TrendingUp className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                  <p className="text-gray-600 text-xs">No recent activity</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Bottom row */}
        <div className="grid lg:grid-cols-2 gap-4">

          {/* Content distribution */}
          <motion.div {...fade(0.3)} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-5">
              <BarChart3 className="w-4 h-4 text-gray-400" />
              <h2 className="text-sm font-semibold text-white">Content Distribution</h2>
            </div>
            {/* Stacked bar */}
            <div className="flex h-2 rounded-full overflow-hidden mb-5 gap-0.5">
              {contentDist.map(c => (
                <div
                  key={c.label}
                  className={`${c.color} transition-all duration-700 rounded-full`}
                  style={{ width: `${Math.round((c.value / total) * 100)}%` }}
                />
              ))}
            </div>
            <div className="space-y-3">
              {contentDist.map(c => (
                <div key={c.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${c.color}`} />
                    <span className="text-gray-400 text-xs">{c.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-1 bg-white/[0.06] rounded-full overflow-hidden">
                      <div className={`h-full ${c.color} rounded-full`} style={{ width: `${Math.round((c.value / total) * 100)}%` }} />
                    </div>
                    <span className="text-white text-xs font-medium w-4 text-right">{c.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Team distribution */}
          <motion.div {...fade(0.35)} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-gray-400" />
                <h2 className="text-sm font-semibold text-white">Team Distribution</h2>
              </div>
              <span className="text-gray-600 text-xs">{stats.members} total</span>
            </div>
            <div className="space-y-3">
              {teams.map((team, i) => {
                const count = teamStats[team] || 0
                const pct = stats.members > 0 ? Math.round((count / stats.members) * 100) : 0
                return (
                  <div key={team} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-xs truncate pr-2">{team.replace(' Team', '')}</span>
                      <span className="text-gray-500 text-xs flex-shrink-0">{count}</span>
                    </div>
                    <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full bg-gradient-to-r ${accentClass.gradient}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, delay: i * 0.08 }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </div>

        {/* Summary strip */}
        <motion.div {...fade(0.4)} className={`rounded-2xl border p-4 ${accentClass.bg} ${accentClass.border}`}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Content', value: stats.events + stats.projects + stats.blogs + stats.merchandise },
              { label: 'Active Teams', value: 6 },
              { label: 'Total Members', value: stats.members },
              { label: 'Site Status', value: 'Active' },
            ].map((item, i) => (
              <div key={item.label} className="text-center">
                <p className={`text-xl font-bold ${accentClass.text}`}>{item.value}</p>
                <p className="text-gray-500 text-xs mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </AdminLayout>
  )
}
