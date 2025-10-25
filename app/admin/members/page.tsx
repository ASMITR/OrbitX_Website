'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Users, Eye, Filter } from 'lucide-react'
import Link from 'next/link'
import AdminLayout from '@/components/admin/AdminLayout'
import { getMembers, deleteMember } from '@/lib/db'
import { Member } from '@/lib/types'
import toast from 'react-hot-toast'

export default function AdminMembers() {
  const [members, setMembers] = useState<Member[]>([])
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([])
  const [filterTeam, setFilterTeam] = useState('all')
  const [loading, setLoading] = useState(true)

  const teams = ['Design & Innovation Team', 'Technical Team', 'Management & Operations Team', 'Public Outreach Team', 'Documentation Team', 'Social Media & Editing Team']

  useEffect(() => {
    fetchMembers()
  }, [])

  useEffect(() => {
    if (filterTeam === 'all') {
      setFilteredMembers(members)
    } else {
      setFilteredMembers(members.filter(member => member.team === filterTeam))
    }
  }, [members, filterTeam])

  const fetchMembers = async () => {
    try {
      const membersData = await getMembers()
      setMembers(membersData)
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
        toast.success('Member deleted successfully')
      } catch (error) {
        toast.error('Failed to delete member')
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

              <div className="flex justify-center space-x-2">
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
              </div>
            </motion.div>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              {filterTeam === 'all' ? 'No members found' : `No members in ${filterTeam}`}
            </h3>
            <p className="text-gray-400">
              {filterTeam === 'all' ? 'Add your first team member to get started.' : 'Try selecting a different team.'}
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}