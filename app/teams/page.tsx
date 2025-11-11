'use client'

import { useState, useEffect, useMemo, useCallback, memo } from 'react'
import { motion } from 'framer-motion'
import { Lightbulb, Cpu, Settings, Users, FileText, Camera, Users as UsersIcon, X } from 'lucide-react'
import { getMembers } from '@/lib/db'
import { Member } from '@/lib/types'
import { POSITIONS } from '@/lib/constants'
import { imageLoader } from '@/lib/performance'
import { getCache, setCache } from '@/lib/cache'

export default function Teams() {
  const [selectedTeam, setSelectedTeam] = useState<any>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const cacheKey = 'teams_members_data'
        let membersData = getCache(cacheKey)
        
        if (!membersData) {
          membersData = await getMembers()
          setCache(cacheKey, membersData, 180000)
        }
        
        setMembers(membersData)
      } catch (error) {
        console.error('Error fetching members:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchMembers()
  }, [])

  const sortMembersByPosition = useCallback((members: Member[]) => {
    return [...members].sort((a, b) => {
      const aIndex = POSITIONS.indexOf(a.position)
      const bIndex = POSITIONS.indexOf(b.position)
      
      const aPos = aIndex === -1 ? POSITIONS.length : aIndex
      const bPos = bIndex === -1 ? POSITIONS.length : bIndex
      
      return aPos - bPos
    })
  }, [])

  const getTeamMembers = useCallback((teamName: string) => {
    const teamMembers = members.filter(member => member.team === teamName && member.approved !== false)
    return sortMembersByPosition(teamMembers)
  }, [members, sortMembersByPosition])

  const teams = useMemo(() => [
    {
      id: 1,
      name: 'Design & Innovation Team',
      icon: Lightbulb,
      shortDescription: 'Creating innovative designs and breakthrough solutions',
      fullDescription: 'Our Design & Innovation Team focuses on creative problem-solving and developing cutting-edge designs for space exploration. We work on conceptual designs, prototype development, and innovative approaches to space technology challenges.',
      color: 'from-cyan-400 to-blue-500',
      members: getTeamMembers('Design & Innovation Team'),
      projects: ['Innovative Satellite Design', 'Space Habitat Concepts', 'Advanced Propulsion Research']
    },
    {
      id: 2,
      name: 'Technical Team',
      icon: Cpu,
      shortDescription: 'Developing technical solutions and systems',
      fullDescription: 'The Technical Team specializes in developing robust technical systems and solutions for space applications. We handle electronics, software development, system integration, and technical implementation of space projects.',
      color: 'from-purple-400 to-pink-400',
      members: getTeamMembers('Technical Team'),
      projects: ['Satellite Systems Integration', 'Mission Control Software', 'Technical Infrastructure']
    },
    {
      id: 3,
      name: 'Management & Operations Team',
      icon: Settings,
      shortDescription: 'Managing projects and operational excellence',
      fullDescription: 'Our Management & Operations Team ensures smooth project execution and operational efficiency. We handle project management, resource allocation, timeline coordination, and operational procedures for all OrbitX initiatives.',
      color: 'from-orange-400 to-red-400',
      members: getTeamMembers('Management & Operations Team'),
      projects: ['Project Coordination', 'Resource Management', 'Operational Procedures']
    },
    {
      id: 4,
      name: 'Public Outreach Team',
      icon: Users,
      shortDescription: 'Connecting with community and stakeholders',
      fullDescription: 'The Public Outreach Team builds bridges between OrbitX and the community. We organize events, manage public relations, conduct educational programs, and engage with stakeholders to promote space exploration awareness.',
      color: 'from-emerald-400 to-teal-400',
      members: getTeamMembers('Public Outreach Team'),
      projects: ['Community Events', 'Educational Programs', 'Stakeholder Engagement']
    },
    {
      id: 5,
      name: 'Documentation Team',
      icon: FileText,
      shortDescription: 'Creating comprehensive project documentation',
      fullDescription: 'Our Documentation Team ensures all projects are properly documented and knowledge is preserved. We create technical documentation, maintain project records, develop user manuals, and establish documentation standards.',
      color: 'from-indigo-400 to-purple-400',
      members: getTeamMembers('Documentation Team'),
      projects: ['Technical Documentation', 'Project Records', 'Knowledge Management']
    },
    {
      id: 6,
      name: 'Social Media & Editing Team',
      icon: Camera,
      shortDescription: 'Managing digital presence and content creation',
      fullDescription: 'The Social Media & Editing Team manages OrbitX\'s digital presence and creates engaging content. We handle social media platforms, video editing, graphic design, and digital marketing to showcase our space exploration journey.',
      color: 'from-yellow-400 to-orange-400',
      members: getTeamMembers('Social Media & Editing Team'),
      projects: ['Social Media Campaigns', 'Video Production', 'Digital Content Creation']
    }
  ], [getTeamMembers])

  return (
    <div className="pt-16 sm:pt-20 px-4 sm:px-6 lg:px-8 gpu-accelerated">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          {loading && (
            <div className="flex justify-center mb-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
            </div>
          )}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Our Domains
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-4xl mx-auto px-4 sm:px-0 leading-relaxed">
            Specialized teams working on cutting-edge space technology
          </p>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 xl:gap-10 mb-8 sm:mb-12 lg:mb-16 xl:mb-20">
          {teams.map((team, index) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="cursor-pointer hover:bg-white/5 transition-all duration-300 group relative overflow-hidden min-h-[300px] sm:min-h-[340px] lg:min-h-[380px] xl:min-h-[420px] flex flex-col border border-white/10 rounded-2xl hover:border-white/30"
              onClick={() => setSelectedTeam(team)}
            >
              {/* Enhanced Background Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${team.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              
              {/* Content */}
              <div className="relative z-10 flex flex-col h-full p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <motion.div 
                    className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-r ${team.color} flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300`}
                    whileHover={{ scale: 1.1 }}
                  >
                    <team.icon className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
                  </motion.div>
                  <div className="text-right">
                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white group-hover:text-cyan-300 transition-colors">{team.members.length}</div>
                    <div className="text-sm text-gray-400 uppercase tracking-wide font-medium">Members</div>
                  </div>
                </div>

                {/* Team Name */}
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-4 leading-tight group-hover:text-cyan-300 transition-colors">
                  {team.name}
                </h3>

                {/* Description */}
                <p className="text-gray-300 mb-6 flex-grow text-sm sm:text-base lg:text-lg leading-relaxed group-hover:text-gray-200 transition-colors">
                  {team.shortDescription}
                </p>

                {/* Member Avatars */}
                {team.members.length > 0 && (
                  <div className="mb-4 sm:mb-6">
                    <div className="flex -space-x-1 sm:-space-x-2 mb-2 sm:mb-3">
                      {team.members.slice(0, 4).map((member: Member, idx: number) => (
                        <img
                          key={idx}
                          src={member.photo}
                          alt={member.name}
                          loading="lazy"
                          className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-gray-800 object-cover"
                        />
                      ))}
                      {team.members.length > 4 && (
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-gray-800 bg-gray-700 flex items-center justify-center text-xs text-white font-medium">
                          +{team.members.length - 4}
                        </div>
                      )}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                      {team.members.slice(0, 2).map(m => m.name.split(' ')[0]).join(', ')}
                      {team.members.length > 2 && ` and ${team.members.length - 2} others`}
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-6 border-t border-white/20 mt-auto">
                  <div className="flex items-center text-cyan-400 group-hover:text-cyan-300 transition-colors">
                    <UsersIcon className="h-5 w-5 mr-2" />
                    <span className="text-base font-semibold">View Team</span>
                  </div>
                  <div className="text-sm text-gray-400 font-medium">
                    {team.projects.length} Projects
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Team Detail Modal */}
        {selectedTeam && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
            onClick={() => setSelectedTeam(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card max-w-2xl w-full max-h-[90vh] sm:max-h-[80vh] overflow-y-auto smooth-scroll p-6 sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${selectedTeam.color} flex items-center justify-center mr-4`}>
                    <selectedTeam.icon className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">{selectedTeam.name}</h2>
                </div>
                <button
                  onClick={() => setSelectedTeam(null)}
                  className="text-gray-400 hover:text-white transition-colors p-1"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <p className="text-gray-300 mb-8 leading-relaxed text-base">
                {selectedTeam.fullDescription}
              </p>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <UsersIcon className="h-5 w-5 mr-2 text-cyan-400" />
                  Team Members ({selectedTeam.members.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedTeam.members.map((member: Member, index: number) => (
                    <div key={index} className="bg-white/10 rounded-xl p-4 hover:bg-white/15 transition-colors group">
                      <div className="flex items-center mb-3">
                        <img
                          src={member.photo}
                          alt={member.name}
                          loading="lazy"
                          className="w-12 h-12 rounded-full object-cover mr-3 ring-2 ring-cyan-400/20 group-hover:ring-cyan-400/40 transition-all"
                        />
                        <div className="flex-1">
                          <div className="text-white font-semibold">{member.name}</div>
                          <div className="text-gray-400 text-sm">{member.position}</div>
                        </div>
                      </div>
                      {member.badges && member.badges.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {member.badges.slice(0, 3).map((badge, idx) => (
                            <span key={idx} className="px-2 py-1 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 text-yellow-300 text-xs rounded-full border border-yellow-400/30">
                              {badge.name}
                            </span>
                          ))}
                          {member.badges.length > 3 && (
                            <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
                              +{member.badges.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                  {selectedTeam.members.length === 0 && (
                    <div className="col-span-2 text-center text-gray-400 py-8 bg-white/5 rounded-xl border-2 border-dashed border-gray-600">
                      <UsersIcon className="h-12 w-12 mx-auto mb-3 text-gray-500" />
                      <div className="text-lg font-medium mb-1">No members assigned</div>
                      <div className="text-sm">This team is ready for new members to join</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-cyan-400" />
                  Current Projects ({selectedTeam.projects.length})
                </h3>
                <div className="space-y-3">
                  {selectedTeam.projects.map((project: string, index: number) => (
                    <div key={index} className="flex items-center text-gray-300 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full mr-4 flex-shrink-0"></div>
                      <span className="text-sm">{project}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}