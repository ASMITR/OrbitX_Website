'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Award, Plus, Users, Calendar, FolderOpen } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import { getMembers, getEvents, getProjects, awardBadge, addMemberToEvent, addMemberToProject } from '@/lib/db'
import { Member, Event, Project, Badge } from '@/lib/types'
import toast from 'react-hot-toast'

export default function ManageMembers() {
  const [members, setMembers] = useState<Member[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [showBadgeModal, setShowBadgeModal] = useState(false)
  const [showEventModal, setShowEventModal] = useState(false)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [membersData, eventsData, projectsData] = await Promise.all([
        getMembers(),
        getEvents(),
        getProjects()
      ])
      setMembers(membersData)
      setEvents(eventsData)
      setProjects(projectsData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAwardBadge = async (badge: Omit<Badge, 'id'>) => {
    if (!selectedMember) return
    
    try {
      await awardBadge(selectedMember.id, badge)
      await fetchData()
      setShowBadgeModal(false)
      toast.success('Badge awarded successfully!')
    } catch (error) {
      toast.error('Failed to award badge')
    }
  }

  const handleAddToEvent = async (eventId: string) => {
    if (!selectedMember) return
    
    try {
      await addMemberToEvent(selectedMember.id, eventId)
      await fetchData()
      setShowEventModal(false)
      toast.success('Member added to event!')
    } catch (error) {
      toast.error('Failed to add member to event')
    }
  }

  const handleAddToProject = async (projectId: string) => {
    if (!selectedMember) return
    
    try {
      await addMemberToProject(selectedMember.id, projectId)
      await fetchData()
      setShowProjectModal(false)
      toast.success('Member added to project!')
    } catch (error) {
      toast.error('Failed to add member to project')
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Manage Members">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Manage Members">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Manage Members</h2>
            <p className="text-gray-400">Award badges and manage event/project participation</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6"
            >
              <div className="flex items-center mb-4">
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="text-lg font-semibold text-white">{member.name}</h3>
                  <p className="text-gray-400 text-sm">{member.team}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-300 mb-2">Badges: {member.badges?.length || 0}</p>
                <p className="text-sm text-gray-300 mb-2">Events: {member.eventsParticipated?.length || 0}</p>
                <p className="text-sm text-gray-300">Projects: {member.projectsParticipated?.length || 0}</p>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedMember(member)
                    setShowBadgeModal(true)
                  }}
                  className="flex-1 px-3 py-2 bg-yellow-500/20 text-yellow-300 rounded hover:bg-yellow-500/30 transition-colors text-sm"
                >
                  <Award className="h-4 w-4 inline mr-1" />
                  Badge
                </button>
                <button
                  onClick={() => {
                    setSelectedMember(member)
                    setShowEventModal(true)
                  }}
                  className="flex-1 px-3 py-2 bg-blue-500/20 text-blue-300 rounded hover:bg-blue-500/30 transition-colors text-sm"
                >
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Event
                </button>
                <button
                  onClick={() => {
                    setSelectedMember(member)
                    setShowProjectModal(true)
                  }}
                  className="flex-1 px-3 py-2 bg-purple-500/20 text-purple-300 rounded hover:bg-purple-500/30 transition-colors text-sm"
                >
                  <FolderOpen className="h-4 w-4 inline mr-1" />
                  Project
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Badge Modal */}
        {showBadgeModal && (
          <BadgeModal
            onClose={() => setShowBadgeModal(false)}
            onAward={handleAwardBadge}
            memberName={selectedMember?.name || ''}
          />
        )}

        {/* Event Modal */}
        {showEventModal && (
          <EventModal
            events={events}
            onClose={() => setShowEventModal(false)}
            onAdd={handleAddToEvent}
            memberName={selectedMember?.name || ''}
          />
        )}

        {/* Project Modal */}
        {showProjectModal && (
          <ProjectModal
            projects={projects}
            onClose={() => setShowProjectModal(false)}
            onAdd={handleAddToProject}
            memberName={selectedMember?.name || ''}
          />
        )}
      </div>
    </AdminLayout>
  )
}

function BadgeModal({ onClose, onAward, memberName }: {
  onClose: () => void
  onAward: (badge: Omit<Badge, 'id'>) => void
  memberName: string
}) {
  const [badge, setBadge] = useState({
    name: '',
    description: '',
    icon: '🏆',
    color: '#FFD700'
  })

  const predefinedBadges = [
    { name: 'Event Participant', description: 'Participated in an event', icon: '🎯', color: '#3B82F6' },
    { name: 'Project Contributor', description: 'Contributed to a project', icon: '🚀', color: '#8B5CF6' },
    { name: 'Team Leader', description: 'Led a team successfully', icon: '👑', color: '#F59E0B' },
    { name: 'Innovation Award', description: 'Showed exceptional innovation', icon: '💡', color: '#10B981' }
  ]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card w-full max-w-md p-6"
      >
        <h3 className="text-xl font-bold text-white mb-4">Award Badge to {memberName}</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {predefinedBadges.map((predefined, index) => (
              <button
                key={index}
                onClick={() => setBadge(predefined)}
                className="p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-left"
              >
                <div className="text-2xl mb-1">{predefined.icon}</div>
                <div className="text-sm text-white font-medium">{predefined.name}</div>
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Badge name"
            value={badge.name}
            onChange={(e) => setBadge({ ...badge, name: e.target.value })}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400"
          />
          
          <textarea
            placeholder="Description"
            value={badge.description}
            onChange={(e) => setBadge({ ...badge, description: e.target.value })}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400"
            rows={3}
          />

          <div className="flex space-x-4 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-white/20 text-gray-300 rounded hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              onClick={() => onAward({
                ...badge,
                awardedAt: new Date().toISOString(),
                awardedBy: 'Admin'
              })}
              disabled={!badge.name}
              className="flex-1 px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-600 disabled:opacity-50"
            >
              Award Badge
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function EventModal({ events, onClose, onAdd, memberName }: {
  events: Event[]
  onClose: () => void
  onAdd: (eventId: string) => void
  memberName: string
}) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card w-full max-w-md p-6 max-h-96 overflow-y-auto"
      >
        <h3 className="text-xl font-bold text-white mb-4">Add {memberName} to Event</h3>
        
        <div className="space-y-2">
          {events.map((event) => (
            <button
              key={event.id}
              onClick={() => onAdd(event.id)}
              className="w-full p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-left"
            >
              <div className="text-white font-medium">{event.title}</div>
              <div className="text-gray-400 text-sm">{new Date(event.date).toLocaleDateString()}</div>
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 px-4 py-2 border border-white/20 text-gray-300 rounded hover:bg-white/10"
        >
          Cancel
        </button>
      </motion.div>
    </div>
  )
}

function ProjectModal({ projects, onClose, onAdd, memberName }: {
  projects: Project[]
  onClose: () => void
  onAdd: (projectId: string) => void
  memberName: string
}) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card w-full max-w-md p-6 max-h-96 overflow-y-auto"
      >
        <h3 className="text-xl font-bold text-white mb-4">Add {memberName} to Project</h3>
        
        <div className="space-y-2">
          {projects.map((project) => (
            <button
              key={project.id}
              onClick={() => onAdd(project.id)}
              className="w-full p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-left"
            >
              <div className="text-white font-medium">{project.title}</div>
              <div className="text-gray-400 text-sm">{new Date(project.date).toLocaleDateString()}</div>
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 px-4 py-2 border border-white/20 text-gray-300 rounded hover:bg-white/10"
        >
          Cancel
        </button>
      </motion.div>
    </div>
  )
}