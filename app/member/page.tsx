'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Award, Calendar, FolderOpen, User } from 'lucide-react'
import { useAuth } from '@/components/admin/AuthProvider'
import { getMembers, getEvents, getProjects } from '@/lib/db'
import { Member, Event, Project } from '@/lib/types'

export default function MemberDashboard() {
  const { user } = useAuth()
  const [member, setMember] = useState<Member | null>(null)
  const [memberEvents, setMemberEvents] = useState<Event[]>([])
  const [memberProjects, setMemberProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.email) {
      fetchMemberData()
    }
  }, [user])

  const fetchMemberData = async () => {
    try {
      const [members, events, projects] = await Promise.all([
        getMembers(),
        getEvents(),
        getProjects()
      ])

      const currentMember = members.find(m => m.email === user?.email)
      if (currentMember) {
        setMember(currentMember)
        
        const participatedEvents = events.filter((e: Event) => 
          currentMember.eventsParticipated?.includes(e.id)
        )
        const participatedProjects = projects.filter((p: Project) => 
          currentMember.projectsParticipated?.includes(p.id)
        )
        
        setMemberEvents(participatedEvents)
        setMemberProjects(participatedProjects)
      }
    } catch (error) {
      console.error('Error fetching member data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    )
  }

  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Member Not Found</h2>
          <p className="text-gray-400">Please contact admin to add you as a member.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 mb-8"
        >
          <div className="flex items-center">
            <img
              src={member.photo}
              alt={member.name}
              className="w-20 h-20 rounded-full object-cover mr-6"
            />
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{member.name}</h1>
              <p className="text-gray-300 mb-1">{member.team} - {member.position}</p>
              <p className="text-gray-400">{member.branch} • {member.year}</p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 text-center"
          >
            <Award className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white">{member.badges?.length || 0}</h3>
            <p className="text-gray-400">Badges Earned</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 text-center"
          >
            <Calendar className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white">{memberEvents.length}</h3>
            <p className="text-gray-400">Events Participated</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6 text-center"
          >
            <FolderOpen className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white">{memberProjects.length}</h3>
            <p className="text-gray-400">Projects Contributed</p>
          </motion.div>
        </div>

        {/* Badges */}
        {member.badges && member.badges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6 mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">My Badges</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {member.badges.map((badge) => (
                <div key={badge.id} className="bg-white/10 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-3">{badge.icon}</span>
                    <div>
                      <h3 className="text-white font-semibold">{badge.name}</h3>
                      <p className="text-gray-400 text-sm">{badge.description}</p>
                    </div>
                  </div>
                  <p className="text-gray-500 text-xs">
                    Awarded on {new Date(badge.awardedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Events & Projects */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Events */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-6"
          >
            <h2 className="text-xl font-bold text-white mb-4">My Events</h2>
            <div className="space-y-3">
              {memberEvents.map((event) => (
                <div key={event.id} className="bg-white/10 rounded-lg p-4">
                  <h3 className="text-white font-medium">{event.title}</h3>
                  <p className="text-gray-400 text-sm">{new Date(event.date).toLocaleDateString()}</p>
                </div>
              ))}
              {memberEvents.length === 0 && (
                <p className="text-gray-400 text-center py-4">No events participated yet</p>
              )}
            </div>
          </motion.div>

          {/* Projects */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card p-6"
          >
            <h2 className="text-xl font-bold text-white mb-4">My Projects</h2>
            <div className="space-y-3">
              {memberProjects.map((project) => (
                <div key={project.id} className="bg-white/10 rounded-lg p-4">
                  <h3 className="text-white font-medium">{project.title}</h3>
                  <p className="text-gray-400 text-sm">{new Date(project.date).toLocaleDateString()}</p>
                </div>
              ))}
              {memberProjects.length === 0 && (
                <p className="text-gray-400 text-center py-4">No projects contributed yet</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}