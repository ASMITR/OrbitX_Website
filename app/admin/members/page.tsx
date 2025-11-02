'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Users, Eye, Filter, Award, X, Calendar, Briefcase, UserPlus } from 'lucide-react'
import Link from 'next/link'
import AdminLayout from '@/components/admin/AdminLayout'
import { getMembers, deleteMember, updateMember, getEvents, getProjects } from '@/lib/db'
import { Member, Event, Project } from '@/lib/types'
import { TEAMS } from '@/lib/constants'
import { useAuth } from '@/components/admin/AuthProvider'
import { getUserRoleFromDB } from '@/lib/roles'
import toast from 'react-hot-toast'

export default function AdminMembers() {
  const [members, setMembers] = useState<Member[]>([])
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([])
  const [pendingMembers, setPendingMembers] = useState<Member[]>([])
  const [filterTeam, setFilterTeam] = useState('all')
  const [activeTab, setActiveTab] = useState<'approved' | 'pending'>('approved')
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<'owner' | 'admin' | 'member'>('member')
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [showBadgeModal, setShowBadgeModal] = useState(false)
  const [showParticipationModal, setShowParticipationModal] = useState(false)
  const [memberBadges, setMemberBadges] = useState<string[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [memberEvents, setMemberEvents] = useState<string[]>([])
  const [memberProjects, setMemberProjects] = useState<string[]>([])
  const { user } = useAuth()

  const teams = TEAMS

  const availableBadges = [
    { name: 'Outstanding Leader', points: 65, color: 'bg-gradient-to-r from-red-500 to-pink-500' },
    { name: 'Visionary', points: 60, color: 'bg-gradient-to-r from-indigo-500 to-purple-500' },
    { name: 'Pioneer', points: 55, color: 'bg-gradient-to-r from-cyan-500 to-blue-500' },
    { name: 'Event Organizer', points: 50, color: 'bg-purple-500' },
    { name: 'Project Leader', points: 45, color: 'bg-blue-500' },
    { name: 'Innovation Award', points: 40, color: 'bg-yellow-500' },
    { name: 'Excellence Award', points: 35, color: 'bg-green-500' },
    { name: 'Mentor/Technical Expert', points: 35, color: 'bg-indigo-500' },
    { name: 'Research Champion', points: 35, color: 'bg-violet-500' },
    { name: 'Active Contributor', points: 30, color: 'bg-cyan-500' },
    { name: 'Problem Solver', points: 30, color: 'bg-emerald-500' },
    { name: 'Creative Thinker', points: 28, color: 'bg-pink-500' },
    { name: 'Team Player', points: 25, color: 'bg-teal-500' },
    { name: 'Collaborator', points: 25, color: 'bg-lime-500' },
    { name: 'Dedicated Member', points: 22, color: 'bg-sky-500' },
    { name: 'Rising Star', points: 20, color: 'bg-amber-500' },
    { name: 'Consistent Performer', points: 18, color: 'bg-slate-500' },
    { name: 'Participation Award', points: 15, color: 'bg-orange-500' },
    { name: 'Attendance Award', points: 12, color: 'bg-rose-500' },
    { name: 'Newcomer', points: 10, color: 'bg-gray-500' },
    { name: 'First Timer', points: 8, color: 'bg-neutral-500' },
    { name: 'Observer', points: 5, color: 'bg-zinc-500' }
  ]

  useEffect(() => {
    fetchMembers()
    fetchEventsAndProjects()
  }, [])

  const fetchEventsAndProjects = async () => {
    try {
      const [eventsData, projectsData] = await Promise.all([
        getEvents(),
        getProjects()
      ])
      setEvents(eventsData)
      setProjects(projectsData)
    } catch (error) {
      console.error('Error fetching events/projects:', error)
    }
  }

  useEffect(() => {
    const checkUserRole = async () => {
      if (user) {
        const role = await getUserRoleFromDB(user)
        setUserRole(role)
      }
    }
    checkUserRole()
  }, [user])

  useEffect(() => {
    const currentMembers = activeTab === 'approved' ? members : pendingMembers
    if (filterTeam === 'all') {
      setFilteredMembers(currentMembers)
    } else {
      setFilteredMembers(currentMembers.filter(member => member.team === filterTeam))
    }
  }, [members, pendingMembers, filterTeam, activeTab])

  const fetchMembers = async () => {
    try {
      const membersData = await getMembers()
      const approved = membersData.filter(member => member.approved !== false)
      const pending = membersData.filter(member => member.approved === false)
      setMembers(approved)
      setPendingMembers(pending)
    } catch (error) {
      console.error('Error fetching members:', error)
      toast.error('Failed to fetch members')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this member?')) {
      try {
        await deleteMember(id)
        setMembers(members.filter(member => member.id !== id))
        setPendingMembers(pendingMembers.filter(member => member.id !== id))
        toast.success('Member deleted successfully')
      } catch (error) {
        toast.error('Failed to delete member')
      }
    }
  }

  const handleApprove = async (id: string) => {
    try {
      await updateMember(id, { 
        approved: true, 
        approvedBy: 'owner',
        approvedAt: new Date().toISOString()
      })
      const approvedMember = pendingMembers.find(member => member.id === id)
      if (approvedMember) {
        setMembers([...members, { ...approvedMember, approved: true, approvedBy: 'owner' }])
        setPendingMembers(pendingMembers.filter(member => member.id !== id))
        toast.success('Member approved by owner successfully')
      }
    } catch (error) {
      toast.error('Failed to approve member')
    }
  }

  const handleReject = async (id: string) => {
    if (confirm('Are you sure you want to reject this member application?')) {
      try {
        await deleteMember(id)
        setPendingMembers(pendingMembers.filter(member => member.id !== id))
        toast.success('Member application rejected')
      } catch (error) {
        toast.error('Failed to reject member')
      }
    }
  }

  const openBadgeModal = (member: Member) => {
    if (userRole !== 'owner' && userRole !== 'admin') {
      toast.error('Only owners and admins can manage badges')
      return
    }
    setSelectedMember(member)
    setMemberBadges(member.badges?.map(b => b.name) || [])
    setShowBadgeModal(true)
  }

  const openParticipationModal = (member: Member) => {
    if (userRole !== 'owner' && userRole !== 'admin') {
      toast.error('Only owners and admins can manage participation')
      return
    }
    setSelectedMember(member)
    setMemberEvents(member.eventsParticipated || [])
    setMemberProjects(member.projectsParticipated || [])
    setShowParticipationModal(true)
  }

  const toggleBadge = (badgeName: string) => {
    setMemberBadges(prev => 
      prev.includes(badgeName) 
        ? prev.filter(b => b !== badgeName)
        : [...prev, badgeName]
    )
  }

  const saveBadges = async () => {
    if (!selectedMember) return
    
    try {
      const badgeObjects = memberBadges.map(badgeName => {
        const badgeInfo = availableBadges.find(b => b.name === badgeName)
        return {
          id: `${badgeName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
          name: badgeName,
          description: `${badgeInfo?.points} points`,
          icon: '🏆',
          color: badgeInfo?.color || 'bg-gray-500',
          awardedAt: new Date().toISOString(),
          awardedBy: userRole
        }
      })

      await updateMember(selectedMember.id, { badges: badgeObjects })
      
      setMembers(prev => prev.map(m => 
        m.id === selectedMember.id 
          ? { ...m, badges: badgeObjects }
          : m
      ))
      
      toast.success('Badges updated successfully')
      setShowBadgeModal(false)
      setSelectedMember(null)
    } catch (error) {
      toast.error('Failed to update badges')
    }
  }

  const saveParticipation = async () => {
    if (!selectedMember) return
    
    try {
      await updateMember(selectedMember.id, {
        eventsParticipated: memberEvents,
        projectsParticipated: memberProjects
      })
      
      setMembers(prev => prev.map(m => 
        m.id === selectedMember.id 
          ? { ...m, eventsParticipated: memberEvents, projectsParticipated: memberProjects }
          : m
      ))
      
      toast.success('Participation updated successfully')
      setShowParticipationModal(false)
      setSelectedMember(null)
    } catch (error) {
      toast.error('Failed to update participation')
    }
  }

  const toggleEvent = (eventId: string) => {
    setMemberEvents(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    )
  }

  const toggleProject = (projectId: string) => {
    setMemberProjects(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    )
  }

  const getRoleColor = (position: string) => {
    switch (position.toLowerCase()) {
      case 'faculty coordinator':
        return 'bg-yellow-500/20 text-yellow-300'
      case 'team lead':
        return 'bg-blue-500/20 text-blue-300'
      case 'core member':
        return 'bg-green-500/20 text-green-300'
      default:
        return 'bg-gray-500/20 text-gray-300'
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Members Management">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Members Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Team Members</h2>
            <p className="text-gray-400">Manage your team members and roles</p>
          </div>
          <Link href="/admin/members/new" className="btn-primary flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Add Member
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white/5 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('approved')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'approved'
                ? 'bg-blue-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Approved Members ({members.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors relative ${
              activeTab === 'pending'
                ? 'bg-yellow-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Pending Owner Approval ({pendingMembers.length})
            {pendingMembers.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {pendingMembers.length}
              </span>
            )}
          </button>
        </div>

        {/* Filter */}
        <div className="flex items-center space-x-4">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={filterTeam}
            onChange={(e) => setFilterTeam(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400"
          >
            <option value="all">All Teams</option>
            {teams.map(team => (
              <option key={team} value={team}>{team}</option>
            ))}
          </select>
          <span className="text-gray-400 text-sm">
            {filteredMembers.length} of {members.length} members
          </span>
        </div>

        {/* Members Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="glass-card p-6 text-center hover:border-cyan-400/50 transition-all duration-300 group relative overflow-hidden"
            >
              {/* Background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative mb-6 z-10">
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-20 h-20 mx-auto rounded-full object-cover border-4 border-white/20 bg-white/5 shadow-lg group-hover:border-cyan-400/50 transition-all duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      target.nextElementSibling?.classList.remove('hidden')
                    }}
                  />
                  <div className="hidden w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border-4 border-white/20 shadow-lg">
                    <span className="text-white font-semibold text-xl">
                      {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </span>
                  </div>
                  {/* Online status indicator */}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                </motion.div>
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                  <motion.span 
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(member.position)} shadow-lg`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {member.position}
                  </motion.span>
                </div>
              </div>

              <div className="relative z-10 mb-4">
                <motion.h3 
                  className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  {member.name}
                </motion.h3>
                <p className="text-gray-400 text-sm mb-1">{member.team}</p>
                <div className="flex items-center justify-center text-xs text-gray-500">
                  <span>{member.branch}</span>
                  <span className="mx-1">•</span>
                  <span>{member.year}</span>
                </div>
              </div>
              
              {/* Additional info for pending members */}
              {activeTab === 'pending' && (
                <div className="text-xs text-gray-400 mb-2 space-y-1">
                  <p>{member.branch} - {member.year} {member.division}</p>
                  <p>Roll: {member.rollNo}</p>
                  <p>{member.email}</p>
                  {member.phone && member.phone !== 'Not specified' && <p>{member.phone}</p>}
                </div>
              )}
              
              {/* Badges Preview */}
              {activeTab === 'approved' && member.badges && member.badges.length > 0 && (
                <div className="mb-3">
                  <div className="flex flex-wrap gap-1 justify-center">
                    {member.badges.slice(0, 2).map((badge, idx) => (
                      <span key={idx} className={`px-2 py-1 text-white text-xs rounded-full ${badge.color || 'bg-gray-500'}`}>
                        🏆 {badge.name}
                      </span>
                    ))}
                    {member.badges.length > 2 && (
                      <span className="px-2 py-1 bg-yellow-600 text-white text-xs rounded-full">
                        +{member.badges.length - 2} badges
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              {/* Participation Preview */}
              {activeTab === 'approved' && ((member.eventsParticipated?.length || 0) > 0 || (member.projectsParticipated?.length || 0) > 0) && (
                <div className="mb-3">
                  <div className="flex flex-wrap gap-1 justify-center">
                    {(member.eventsParticipated?.length || 0) > 0 && (
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30">
                        📅 {member.eventsParticipated?.length || 0} Events
                      </span>
                    )}
                    {(member.projectsParticipated?.length || 0) > 0 && (
                      <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full border border-green-500/30">
                        💼 {member.projectsParticipated?.length || 0} Projects
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              {/* Skills Preview */}
              {member.skills && member.skills.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1 justify-center">
                    {member.skills.slice(0, 2).map((skill, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30">
                        {skill}
                      </span>
                    ))}
                    {member.skills.length > 2 && (
                      <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
                        +{member.skills.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              {/* Social Links for pending members */}
              {activeTab === 'pending' && member.socialLinks && (
                <div className="flex justify-center space-x-2 mb-3">
                  {member.socialLinks.linkedin && (
                    <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                      <span className="text-xs">LinkedIn</span>
                    </a>
                  )}
                  {member.socialLinks.github && (
                    <a href={member.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-300">
                      <span className="text-xs">GitHub</span>
                    </a>
                  )}
                  {member.socialLinks.instagram && (
                    <a href={member.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:text-pink-300">
                      <span className="text-xs">Instagram</span>
                    </a>
                  )}
                </div>
              )}

              <div className="relative z-10">
                {activeTab === 'pending' ? (
                  <div className="flex flex-col space-y-2">
                    <motion.button 
                      onClick={() => handleApprove(member.id)}
                      className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-sm rounded-lg transition-all duration-300 shadow-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      ✓ Owner Approve
                    </motion.button>
                    <motion.button 
                      onClick={() => handleReject(member.id)}
                      className="w-full px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm rounded-lg transition-all duration-300 shadow-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      ✗ Owner Reject
                    </motion.button>
                  </div>
                ) : (
                  <div className="flex justify-center space-x-2">
                    <motion.button 
                      className="p-3 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-xl transition-all duration-300 shadow-lg"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </motion.button>
                    <Link href={`/admin/members/${member.id}/edit`}>
                      <motion.button 
                        className="p-3 bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 rounded-xl transition-all duration-300 shadow-lg"
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.9 }}
                        title="Edit Member"
                      >
                        <Edit className="h-4 w-4" />
                      </motion.button>
                    </Link>
                    {(userRole === 'owner' || userRole === 'admin') && (
                      <>
                        <motion.button 
                          onClick={() => openBadgeModal(member)}
                          className="p-3 bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 rounded-xl transition-all duration-300 shadow-lg"
                          whileHover={{ scale: 1.1, y: -2 }}
                          whileTap={{ scale: 0.9 }}
                          title="Manage Badges"
                        >
                          <Award className="h-4 w-4" />
                        </motion.button>
                        <motion.button 
                          onClick={() => openParticipationModal(member)}
                          className="p-3 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-xl transition-all duration-300 shadow-lg"
                          whileHover={{ scale: 1.1, y: -2 }}
                          whileTap={{ scale: 0.9 }}
                          title="Manage Participation"
                        >
                          <UserPlus className="h-4 w-4" />
                        </motion.button>
                      </>
                    )}
                    <motion.button 
                      onClick={() => handleDelete(member.id)}
                      className="p-3 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-xl transition-all duration-300 shadow-lg"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      title="Delete Member"
                    >
                      <Trash2 className="h-4 w-4" />
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              {activeTab === 'pending' 
                ? 'No pending owner approvals' 
                : filterTeam === 'all' 
                  ? 'No members found' 
                  : `No members in ${filterTeam}`
              }
            </h3>
            <p className="text-gray-400">
              {activeTab === 'pending'
                ? 'All member applications have been processed by the owner.'
                : filterTeam === 'all' 
                  ? 'Add your first team member to get started.' 
                  : 'Try selecting a different team.'
              }
            </p>
          </div>
        )}

        {/* Badge Management Modal */}
        {showBadgeModal && selectedMember && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-card max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">
                  Manage Badges - {selectedMember.name}
                </h3>
                <button
                  onClick={() => setShowBadgeModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                {availableBadges.map((badge) => (
                  <button
                    key={badge.name}
                    type="button"
                    onClick={() => toggleBadge(badge.name)}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      memberBadges.includes(badge.name)
                        ? `${badge.color} border-white/30 text-white`
                        : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{badge.name}</div>
                        <div className="text-sm opacity-75">{badge.points} points</div>
                      </div>
                      <div className="text-xl">🏆</div>
                    </div>
                  </button>
                ))}
              </div>

              {memberBadges.length > 0 && (
                <div className="mb-6 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="text-sm text-blue-300 mb-2">Selected badges:</div>
                  <div className="flex flex-wrap gap-2">
                    {memberBadges.map((badgeName) => {
                      const badge = availableBadges.find(b => b.name === badgeName)
                      return (
                        <span key={badgeName} className={`px-2 py-1 rounded-full text-xs text-white ${badge?.color}`}>
                          🏆 {badgeName}
                        </span>
                      )
                    })}
                  </div>
                  <div className="text-xs text-blue-400 mt-2">
                    Total Points: {memberBadges.reduce((sum, badgeName) => {
                      const badge = availableBadges.find(b => b.name === badgeName)
                      return sum + (badge?.points || 0)
                    }, 0)}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowBadgeModal(false)}
                  className="px-4 py-2 border border-white/20 text-gray-300 rounded-lg hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveBadges}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Save Badges
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Participation Management Modal */}
        {showParticipationModal && selectedMember && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-card max-w-4xl w-full max-h-[80vh] overflow-y-auto p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">
                  Manage Participation - {selectedMember.name}
                </h3>
                <button
                  onClick={() => setShowParticipationModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Events Section */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-blue-400" />
                    Events ({memberEvents.length})
                  </h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {events.map((event) => (
                      <button
                        key={event.id}
                        onClick={() => toggleEvent(event.id)}
                        className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                          memberEvents.includes(event.id)
                            ? 'bg-blue-500/20 border-blue-400 text-white'
                            : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/20'
                        }`}
                      >
                        <div className="font-medium">{event.title}</div>
                        <div className="text-sm opacity-75">{new Date(event.date).toLocaleDateString()}</div>
                      </button>
                    ))}
                    {events.length === 0 && (
                      <div className="text-gray-400 text-center py-4">No events available</div>
                    )}
                  </div>
                </div>

                {/* Projects Section */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Briefcase className="h-5 w-5 mr-2 text-green-400" />
                    Projects ({memberProjects.length})
                  </h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {projects.map((project) => (
                      <button
                        key={project.id}
                        onClick={() => toggleProject(project.id)}
                        className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                          memberProjects.includes(project.id)
                            ? 'bg-green-500/20 border-green-400 text-white'
                            : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/20'
                        }`}
                      >
                        <div className="font-medium">{project.title}</div>
                        <div className="text-sm opacity-75">{new Date(project.date).toLocaleDateString()}</div>
                      </button>
                    ))}
                    {projects.length === 0 && (
                      <div className="text-gray-400 text-center py-4">No projects available</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Summary */}
              {(memberEvents.length > 0 || memberProjects.length > 0) && (
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-green-500/10 border border-white/20 rounded-lg">
                  <div className="text-sm text-white mb-2">Participation Summary:</div>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span className="text-blue-300">
                      📅 {memberEvents.length} Events
                    </span>
                    <span className="text-green-300">
                      💼 {memberProjects.length} Projects
                    </span>
                    <span className="text-yellow-300">
                      🏆 Total Activity Score: {(memberEvents.length * 5) + (memberProjects.length * 10)}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setShowParticipationModal(false)}
                  className="px-4 py-2 border border-white/20 text-gray-300 rounded-lg hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveParticipation}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:from-blue-600 hover:to-green-600 transition-colors"
                >
                  Save Participation
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}