'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Users, Eye, Filter } from 'lucide-react'
import Link from 'next/link'
import AdminLayout from '@/components/admin/AdminLayout'
import { getMembers, deleteMember, updateMember } from '@/lib/db'
import { Member } from '@/lib/types'
import { TEAMS } from '@/lib/constants'
import toast from 'react-hot-toast'

export default function AdminMembers() {
  const [members, setMembers] = useState<Member[]>([])
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([])
  const [pendingMembers, setPendingMembers] = useState<Member[]>([])
  const [filterTeam, setFilterTeam] = useState('all')
  const [activeTab, setActiveTab] = useState<'approved' | 'pending'>('approved')
  const [loading, setLoading] = useState(true)

  const teams = TEAMS

  useEffect(() => {
    fetchMembers()
  }, [])

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
          {filteredMembers.map((member) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 text-center"
            >
              <div className="relative mb-4">
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-16 h-16 mx-auto rounded-full object-cover border-2 border-white/20"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    target.nextElementSibling?.classList.remove('hidden')
                  }}
                />
                <div className="hidden w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border-2 border-white/20">
                  <span className="text-white font-semibold text-lg">
                    {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(member.position)}`}>
                    {member.position}
                  </span>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-white mb-1">{member.name}</h3>
              <p className="text-gray-400 text-sm mb-2">{member.team}</p>
              
              {/* Additional info for pending members */}
              {activeTab === 'pending' && (
                <div className="text-xs text-gray-400 mb-2 space-y-1">
                  <p>{member.branch} - {member.year} {member.division}</p>
                  <p>Roll: {member.rollNo}</p>
                  <p>{member.email}</p>
                  {member.phone && member.phone !== 'Not specified' && <p>{member.phone}</p>}
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

              <div className="flex justify-center space-x-2">
                {activeTab === 'pending' ? (
                  <>
                    <button 
                      onClick={() => handleApprove(member.id)}
                      className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded-full transition-colors"
                    >
                      Owner Approve
                    </button>
                    <button 
                      onClick={() => handleReject(member.id)}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded-full transition-colors"
                    >
                      Owner Reject
                    </button>
                  </>
                ) : (
                  <>
                    <button className="p-2 text-gray-400 hover:text-blue-400 transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                    <Link href={`/admin/members/${member.id}/edit`}>
                      <button className="p-2 text-gray-400 hover:text-yellow-400 transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                    </Link>
                    <button 
                      onClick={() => handleDelete(member.id)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
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
      </div>
    </AdminLayout>
  )
}