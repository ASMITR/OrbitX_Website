'use client'

import { useState, useEffect, useMemo, useCallback, memo } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Search, Filter, Linkedin, Github, Instagram, X, BookOpen, Briefcase, Award } from 'lucide-react'
import { getMembers } from '@/lib/db'
import { Member } from '@/lib/types'
import { POSITIONS } from '@/lib/constants'
import { imageLoader, debounce } from '@/lib/performance'
import { getCache, setCache } from '@/lib/cache'
import { testFirebaseConnection } from '@/lib/firebaseTest'

export default function Members() {
  const [members, setMembers] = useState<Member[]>([])
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTeam, setFilterTeam] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)

  const sortMembersByPosition = useCallback((members: Member[]) => {
    return [...members].sort((a, b) => {
      const aIndex = POSITIONS.indexOf(a.position)
      const bIndex = POSITIONS.indexOf(b.position)
      
      const aPos = aIndex === -1 ? POSITIONS.length : aIndex
      const bPos = bIndex === -1 ? POSITIONS.length : bIndex
      
      if (aPos !== bPos) {
        return aPos - bPos
      }
      
      // If same position, sort by name
      return a.name.localeCompare(b.name)
    })
  }, [])

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        // First test Firebase connection
        const connectionTest = await testFirebaseConnection()
        if (!connectionTest.success) {
          throw new Error(`Firebase connection failed: ${connectionTest.error}`)
        }

        const cacheKey = 'members_data'
        let membersData = getCache(cacheKey)
        
        if (!membersData) {
          membersData = await getMembers()
          setCache(cacheKey, membersData, 180000) // 3 minute cache
        }
        
        const approvedMembers = membersData.filter((member: Member) => member.approved !== false)
        const sortedMembers = sortMembersByPosition(approvedMembers)
        setMembers(sortedMembers)
        setFilteredMembers(sortedMembers)
      } catch (error: any) {
        console.error('Error fetching members:', error)
        
        // Provide specific error messages based on error type
        if (error.message.includes('Firebase connection failed')) {
          setError('Unable to connect to the database. Please check your internet connection and try again.')
        } else if (error.message.includes('permission-denied')) {
          setError('Access denied. The database may be temporarily unavailable.')
        } else if (error.message.includes('unavailable')) {
          setError('Database service is temporarily unavailable. Please try again in a few moments.')
        } else {
          setError('Failed to load members. Please check your internet connection and try again.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchMembers()
  }, [sortMembersByPosition])

  const filteredAndSortedMembers = useMemo(() => {
    let filtered = members.filter(member =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.team.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (filterTeam !== 'all') {
      filtered = filtered.filter(member => member.team === filterTeam)
    }

    return sortMembersByPosition(filtered)
  }, [searchTerm, filterTeam, members, sortMembersByPosition])

  useEffect(() => {
    setFilteredMembers(filteredAndSortedMembers)
  }, [filteredAndSortedMembers])

  const displayMembers = filteredMembers
  const teams = ['Design & Innovation Team', 'Technical Team', 'Management & Operations Team', 'Public Outreach Team', 'Documentation Team', 'Social Media & Editing Team']

  const getRoleColor = (position: string) => {
    if (!position) return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    switch (position.toLowerCase()) {
      case 'president':
        return 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border-yellow-500/30'
      case 'chairman':
        return 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30'
      case 'secretary':
        return 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/30'
      case 'treasurer':
      case 'co-treasurer':
        return 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30'
      case 'team leader':
        return 'bg-gradient-to-r from-indigo-500/20 to-blue-500/20 text-indigo-300 border-indigo-500/30'
      case 'member':
        return 'bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-300 border-gray-500/30'
      default:
        return 'bg-gradient-to-r from-teal-500/20 to-cyan-500/20 text-teal-300 border-teal-500/30'
    }
  }

  if (loading) {
    return (
      <div className="pt-20 px-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading members...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="pt-20 px-4 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-lg">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Connection Error</h3>
          <p className="text-gray-400 text-base sm:text-lg px-4 mb-6">
            {error}
          </p>
          <div className="space-y-3">
            <button 
              onClick={() => {
                setError(null)
                setLoading(true)
                // Force a fresh fetch without page reload
                const fetchMembers = async () => {
                  try {
                    const connectionTest = await testFirebaseConnection()
                    if (!connectionTest.success) {
                      throw new Error(`Firebase connection failed: ${connectionTest.error}`)
                    }
                    const membersData = await getMembers()
                    const approvedMembers = membersData.filter((member: Member) => member.approved !== false)
                    const sortedMembers = sortMembersByPosition(approvedMembers)
                    setMembers(sortedMembers)
                    setFilteredMembers(sortedMembers)
                    setCache('members_data', membersData, 180000)
                  } catch (error: any) {
                    setError('Still unable to connect. Please check your internet connection.')
                  } finally {
                    setLoading(false)
                  }
                }
                fetchMembers()
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-3"
            >
              Retry Connection
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
          <div className="mt-6 text-sm text-gray-500">
            <p>If the problem persists, please:</p>
            <ul className="mt-2 space-y-1">
              <li>• Check your internet connection</li>
              <li>• Try refreshing the page</li>
              <li>• Contact support if the issue continues</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-16 sm:pt-20 px-3 sm:px-4 lg:px-6 xl:px-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight">
            Our Team
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-2xl lg:max-w-3xl mx-auto mb-6 sm:mb-8 px-2 sm:px-0 leading-relaxed">
            Meet the passionate individuals who make OrbitX's mission possible. 
            From faculty coordinators to dedicated students, we're all united by our love for space exploration.
          </p>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-xl sm:max-w-3xl mx-auto px-2 sm:px-0">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
              <input
                type="text"
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
              />
            </div>
            <div className="relative sm:flex-shrink-0">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
              <select
                value={filterTeam}
                onChange={(e) => setFilterTeam(e.target.value)}
                className="w-full sm:w-auto pl-9 sm:pl-10 pr-8 py-2.5 sm:py-3 bg-black border border-white/20 rounded-lg text-sm sm:text-base text-white focus:outline-none focus:border-blue-400 transition-colors appearance-none min-w-[180px] sm:min-w-[200px]"
              >
                <option value="all">All Teams</option>
                {teams.map(team => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>
            </div>
            <a
              href="/leaderboard"
              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 text-sm sm:text-base whitespace-nowrap flex items-center justify-center"
            >
              🏆 Leaderboard
            </a>
          </div>
        </div>

        {/* Leadership Team Section */}
        {!loading && filteredMembers.filter(member => 
          member.position.toLowerCase().includes('president') || 
          member.position.toLowerCase().includes('chairman') || 
          member.position.toLowerCase().includes('secretary') ||
          member.position.toLowerCase().includes('treasurer')
        ).length > 0 && (
          <div className="mb-12 sm:mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Leadership Team
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {filteredMembers
                .filter(member => 
                  member.position.toLowerCase().includes('president') || 
                  member.position.toLowerCase().includes('chairman') || 
                  member.position.toLowerCase().includes('secretary') ||
                  member.position.toLowerCase().includes('treasurer')
                )
                .sort((a, b) => {
                  const order = ['president', 'chairman', 'secretary', 'treasurer', 'co-treasurer']
                  const aIndex = order.findIndex(pos => a.position.toLowerCase().includes(pos))
                  const bIndex = order.findIndex(pos => b.position.toLowerCase().includes(pos))
                  return aIndex - bIndex
                })
                .map((member, index) => (
                  <div
                    key={member.id}
                    className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-yellow-900/30 to-orange-900/30 backdrop-blur-md border-2 border-yellow-500/30 shadow-xl hover:shadow-yellow-500/20 transition-all duration-300 hover:scale-[1.02] hover:border-yellow-400/50"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                    
                    <div className="relative h-64 sm:h-72 lg:h-80 overflow-hidden bg-gray-900/50 flex items-center justify-center">
                      <Image
                        src={member.photo}
                        alt={member.name}
                        width={300}
                        height={320}
                        loader={imageLoader}
                        priority={index < 4}
                        loading={index < 4 ? 'eager' : 'lazy'}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          target.nextElementSibling?.classList.remove('hidden')
                        }}
                      />
                      <div className="hidden w-full h-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
                        <div className="text-6xl sm:text-7xl lg:text-8xl opacity-30">👤</div>
                      </div>
                      
                      <div 
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex items-center justify-center cursor-pointer"
                        onClick={() => setSelectedMember(member)}
                      >
                        <div className="text-center">
                          <div className="text-white text-sm mb-2">View Profile</div>
                          <div className="w-12 h-0.5 bg-yellow-400 mx-auto"></div>
                        </div>
                      </div>
                    </div>

                    <div className="relative z-20 p-2 sm:p-3 lg:p-4 xl:p-6 bg-gradient-to-t from-black/95 to-transparent">
                      <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white mb-1 sm:mb-2 group-hover:text-yellow-300 transition-colors line-clamp-1 sm:line-clamp-2 leading-tight">
                        {member.name}
                      </h3>
                      {member.team && member.team !== 'NA' && (
                        <p className="text-yellow-400 text-xs font-medium mb-1 line-clamp-1 leading-tight hidden sm:block">{member.team}</p>
                      )}
                      <div className="mb-1 sm:mb-2">
                        <span className={`inline-block px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-semibold ${getRoleColor(member.position)} border truncate max-w-full`}>
                          {member.position}
                        </span>
                      </div>
                      <p className="text-gray-400 text-xs mb-1 sm:mb-2 line-clamp-1 hidden sm:block">{member.branch} • {member.year}-{member.division}</p>
                      
                      <div className="flex justify-between items-center gap-1 sm:gap-2">
                        <div className="flex space-x-1 flex-shrink-0 min-w-0">
                          {member.socialLinks?.linkedin && (
                            <a
                              href={member.socialLinks.linkedin.startsWith('http') ? member.socialLinks.linkedin : `https://${member.socialLinks.linkedin}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 bg-blue-600/20 border border-blue-500/30 rounded flex items-center justify-center hover:bg-blue-600/40 hover:scale-110 transition-all duration-200 group/social flex-shrink-0"
                            >
                              <Linkedin className="h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-3.5 lg:w-3.5 text-blue-400 group-hover/social:text-blue-300" />
                            </a>
                          )}
                          {member.socialLinks?.github && (
                            <a
                              href={member.socialLinks.github.startsWith('http') ? member.socialLinks.github : `https://${member.socialLinks.github}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 bg-gray-600/20 border border-gray-500/30 rounded flex items-center justify-center hover:bg-gray-600/40 hover:scale-110 transition-all duration-200 group/social flex-shrink-0"
                            >
                              <Github className="h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-3.5 lg:w-3.5 text-gray-400 group-hover/social:text-gray-300" />
                            </a>
                          )}
                          {member.socialLinks?.instagram && (
                            <a
                              href={member.socialLinks.instagram.startsWith('http') ? member.socialLinks.instagram : `https://${member.socialLinks.instagram}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 bg-pink-600/20 border border-pink-500/30 rounded flex items-center justify-center hover:bg-pink-600/40 hover:scale-110 transition-all duration-200 group/social flex-shrink-0"
                            >
                              <Instagram className="h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-3.5 lg:w-3.5 text-pink-400 group-hover/social:text-pink-300" />
                            </a>
                          )}
                        </div>
                        
                        <button 
                          onClick={() => setSelectedMember(member)}
                          className="px-1.5 py-1 sm:px-2 sm:py-1 lg:px-3 lg:py-1.5 bg-yellow-600/20 border border-yellow-500/30 rounded text-yellow-400 text-xs font-medium hover:bg-yellow-600/40 transition-all duration-200 flex-shrink-0 whitespace-nowrap"
                        >
                          View
                        </button>
                      </div>
                    </div>
                    
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500" />
                    <div className="absolute -top-10 -right-10 w-20 h-20 bg-yellow-500/10 rounded-full blur-xl group-hover:bg-yellow-500/20 transition-all duration-500" />
                    <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-orange-500/10 rounded-full blur-xl group-hover:bg-orange-500/20 transition-all duration-500" />
                  </div>
                ))
              }
            </div>
          </div>
        )}

        {/* Team Leaders Section */}
        {!loading && filteredMembers.filter(member => 
          member.position.toLowerCase().includes('team leader')
        ).length > 0 && (
          <div className="mb-12 sm:mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
                Team Leaders
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-indigo-400 to-blue-400 mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {filteredMembers
                .filter(member => member.position.toLowerCase().includes('team leader'))
                .map((member, index) => {
                  return (
                    <div
                      key={member.id}
                      className="group relative overflow-hidden rounded-xl sm:rounded-2xl backdrop-blur-md border-2 shadow-xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-indigo-900/30 to-blue-900/30 border-indigo-500/30 hover:shadow-indigo-500/20 hover:border-indigo-400/50"
                    >
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
              
              <div className="relative h-64 sm:h-72 lg:h-80 overflow-hidden bg-gray-900/50 flex items-center justify-center">
                <Image
                  src={member.photo}
                  alt={member.name}
                  width={300}
                  height={320}
                  loader={imageLoader}
                  priority={index < 8}
                  loading={index < 8 ? 'eager' : 'lazy'}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    target.nextElementSibling?.classList.remove('hidden')
                  }}
                />
                <div className="hidden w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  <div className="text-6xl sm:text-7xl lg:text-8xl opacity-30">👤</div>
                </div>
                
                <div 
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex items-center justify-center cursor-pointer"
                  onClick={() => setSelectedMember(member)}
                >
                  <div className="text-center">
                    <div className="text-white text-sm mb-2">View Profile</div>
                    <div className="w-12 h-0.5 mx-auto bg-indigo-400"></div>
                  </div>
                </div>
              </div>

              <div className="relative z-20 p-2 sm:p-3 lg:p-4 xl:p-6 bg-gradient-to-t from-black/95 to-transparent">
                <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white mb-1 sm:mb-2 transition-colors line-clamp-1 sm:line-clamp-2 leading-tight group-hover:text-indigo-300">
                  {member.name}
                </h3>
                {member.team && member.team !== 'NA' && (
                  <p className="text-indigo-400 text-xs font-medium mb-1 line-clamp-1 leading-tight hidden sm:block">{member.team}</p>
                )}
                <div className="mb-1 sm:mb-2">
                  <span className={`inline-block px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-semibold ${getRoleColor(member.position)} border truncate max-w-full`}>
                    {member.position}
                  </span>
                </div>
                <p className="text-gray-400 text-xs mb-1 sm:mb-2 line-clamp-1 hidden sm:block">{member.branch} • {member.year}-{member.division}</p>
                
                {member.skills && member.skills.length > 0 && (
                  <div className="mb-1 sm:mb-2 hidden md:block">
                    <div className="flex flex-wrap gap-1">
                      {member.skills.slice(0, 1).map((skill, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30 truncate max-w-[60px] lg:max-w-[80px]">
                          {skill}
                        </span>
                      ))}
                      {member.skills.length > 1 && (
                        <span className="px-1.5 py-0.5 bg-gray-700 text-gray-300 text-xs rounded-full flex-shrink-0">
                          +{member.skills.length - 1}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center gap-1 sm:gap-2">
                  <div className="flex space-x-1 flex-shrink-0 min-w-0">
                    {member.socialLinks?.linkedin && (
                      <a
                        href={member.socialLinks.linkedin.startsWith('http') ? member.socialLinks.linkedin : `https://${member.socialLinks.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 bg-blue-600/20 border border-blue-500/30 rounded flex items-center justify-center hover:bg-blue-600/40 hover:scale-110 transition-all duration-200 group/social flex-shrink-0"
                      >
                        <Linkedin className="h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-3.5 lg:w-3.5 text-blue-400 group-hover/social:text-blue-300" />
                      </a>
                    )}
                    {member.socialLinks?.github && (
                      <a
                        href={member.socialLinks.github.startsWith('http') ? member.socialLinks.github : `https://${member.socialLinks.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 bg-gray-600/20 border border-gray-500/30 rounded flex items-center justify-center hover:bg-gray-600/40 hover:scale-110 transition-all duration-200 group/social flex-shrink-0"
                      >
                        <Github className="h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-3.5 lg:w-3.5 text-gray-400 group-hover/social:text-gray-300" />
                      </a>
                    )}
                    {member.socialLinks?.instagram && (
                      <a
                        href={member.socialLinks.instagram.startsWith('http') ? member.socialLinks.instagram : `https://${member.socialLinks.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 bg-pink-600/20 border border-pink-500/30 rounded flex items-center justify-center hover:bg-pink-600/40 hover:scale-110 transition-all duration-200 group/social flex-shrink-0"
                      >
                        <Instagram className="h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-3.5 lg:w-3.5 text-pink-400 group-hover/social:text-pink-300" />
                      </a>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => setSelectedMember(member)}
                    className="px-1.5 py-1 sm:px-2 sm:py-1 lg:px-3 lg:py-1.5 rounded text-xs font-medium transition-all duration-200 flex-shrink-0 whitespace-nowrap bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-600/40"
                  >
                    View
                  </button>
                </div>
              </div>
              
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500" />
              <div className="absolute -top-10 -right-10 w-20 h-20 rounded-full blur-xl transition-all duration-500 bg-indigo-500/10 group-hover:bg-indigo-500/20" />
              <div className="absolute -bottom-10 -left-10 w-16 h-16 rounded-full blur-xl transition-all duration-500 bg-blue-500/10 group-hover:bg-blue-500/20" />
                    </div>
                  )
                })
              }
            </div>
          </div>
        )}

        {/* Members Section */}
        {!loading && filteredMembers.filter(member => 
          member.position.toLowerCase() === 'member' ||
          (!member.position.toLowerCase().includes('president') && 
           !member.position.toLowerCase().includes('chairman') && 
           !member.position.toLowerCase().includes('secretary') &&
           !member.position.toLowerCase().includes('treasurer') &&
           !member.position.toLowerCase().includes('team leader'))
        ).length > 0 && (
          <div className="mb-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
                Members
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-teal-400 mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
              {filteredMembers
                .filter(member => 
                  member.position.toLowerCase() === 'member' ||
                  (!member.position.toLowerCase().includes('president') && 
                   !member.position.toLowerCase().includes('chairman') && 
                   !member.position.toLowerCase().includes('secretary') &&
                   !member.position.toLowerCase().includes('treasurer') &&
                   !member.position.toLowerCase().includes('team leader'))
                )
                .map((member, index) => {
                  return (
                    <div
                      key={member.id}
                      className="group relative overflow-hidden rounded-xl sm:rounded-2xl backdrop-blur-md border-2 shadow-xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-green-900/30 to-teal-900/30 border-green-500/30 hover:shadow-green-500/20 hover:border-green-400/50"
                    >
              {/* Background Image */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
              
              {/* Profile Photo */}
              <div className="relative h-64 sm:h-72 lg:h-80 overflow-hidden bg-gray-900/50 flex items-center justify-center">
                <Image
                  src={member.photo}
                  alt={member.name}
                  width={300}
                  height={320}
                  loader={imageLoader}
                  priority={index < 8}
                  loading={index < 8 ? 'eager' : 'lazy'}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    target.nextElementSibling?.classList.remove('hidden')
                  }}
                />
                <div className="hidden w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  <div className="text-6xl sm:text-7xl lg:text-8xl opacity-30">👤</div>
                </div>
                

                
                {/* Hover Overlay */}
                <div 
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex items-center justify-center cursor-pointer"
                  onClick={() => setSelectedMember(member)}
                >
                  <div className="text-center">
                    <div className="text-white text-sm mb-2">View Profile</div>
                    <div className="w-12 h-0.5 mx-auto bg-green-400"></div>
                  </div>
                </div>
              </div>

              {/* Member Info */}
              <div className="relative z-20 p-2 sm:p-3 lg:p-4 xl:p-6 bg-gradient-to-t from-black/95 to-transparent">
                <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white mb-1 sm:mb-2 transition-colors line-clamp-1 sm:line-clamp-2 leading-tight group-hover:text-green-300">
                  {member.name}
                </h3>
                {member.team && member.team !== 'NA' && (
                  <p className="text-green-400 text-xs font-medium mb-1 line-clamp-1 leading-tight hidden sm:block">{member.team}</p>
                )}
                <div className="mb-1 sm:mb-2">
                  <span className={`inline-block px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-semibold ${getRoleColor(member.position)} border truncate max-w-full`}>
                    {member.position}
                  </span>
                </div>
                <p className="text-gray-400 text-xs mb-1 sm:mb-2 line-clamp-1 hidden sm:block">{member.branch} • {member.year}-{member.division}</p>
                


                {/* Skills */}
                {member.skills && member.skills.length > 0 && (
                  <div className="mb-1 sm:mb-2 hidden md:block">
                    <div className="flex flex-wrap gap-1">
                      {member.skills.slice(0, 1).map((skill, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30 truncate max-w-[60px] lg:max-w-[80px]">
                          {skill}
                        </span>
                      ))}
                      {member.skills.length > 1 && (
                        <span className="px-1.5 py-0.5 bg-gray-700 text-gray-300 text-xs rounded-full flex-shrink-0">
                          +{member.skills.length - 1}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Social Links */}
                <div className="flex justify-between items-center gap-1 sm:gap-2">
                  <div className="flex space-x-1 flex-shrink-0 min-w-0">
                    {member.socialLinks?.linkedin && (
                      <a
                        href={member.socialLinks.linkedin.startsWith('http') ? member.socialLinks.linkedin : `https://${member.socialLinks.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 bg-blue-600/20 border border-blue-500/30 rounded flex items-center justify-center hover:bg-blue-600/40 hover:scale-110 transition-all duration-200 group/social flex-shrink-0"
                        aria-label="LinkedIn"
                      >
                        <Linkedin className="h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-3.5 lg:w-3.5 text-blue-400 group-hover/social:text-blue-300" />
                      </a>
                    )}
                    {member.socialLinks?.github && (
                      <a
                        href={member.socialLinks.github.startsWith('http') ? member.socialLinks.github : `https://${member.socialLinks.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 bg-gray-600/20 border border-gray-500/30 rounded flex items-center justify-center hover:bg-gray-600/40 hover:scale-110 transition-all duration-200 group/social flex-shrink-0"
                        aria-label="GitHub"
                      >
                        <Github className="h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-3.5 lg:w-3.5 text-gray-400 group-hover/social:text-gray-300" />
                      </a>
                    )}
                    {member.socialLinks?.instagram && (
                      <a
                        href={member.socialLinks.instagram.startsWith('http') ? member.socialLinks.instagram : `https://${member.socialLinks.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 bg-pink-600/20 border border-pink-500/30 rounded flex items-center justify-center hover:bg-pink-600/40 hover:scale-110 transition-all duration-200 group/social flex-shrink-0"
                        aria-label="Instagram"
                      >
                        <Instagram className="h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-3.5 lg:w-3.5 text-pink-400 group-hover/social:text-pink-300" />
                      </a>
                    )}
                  </div>
                  
                  {/* View More Button */}
                  <button 
                    onClick={() => setSelectedMember(member)}
                    className="px-1.5 py-1 sm:px-2 sm:py-1 lg:px-3 lg:py-1.5 rounded text-xs font-medium transition-all duration-200 flex-shrink-0 whitespace-nowrap bg-green-600/20 border border-green-500/30 text-green-400 hover:bg-green-600/40"
                  >
                    View
                  </button>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-teal-500 to-emerald-500" />
              <div className="absolute -top-10 -right-10 w-20 h-20 rounded-full blur-xl transition-all duration-500 bg-green-500/10 group-hover:bg-green-500/20" />
              <div className="absolute -bottom-10 -left-10 w-16 h-16 rounded-full blur-xl transition-all duration-500 bg-teal-500/10 group-hover:bg-teal-500/20" />
                    </div>
                  )
                })
              }
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredMembers.length === 0 && searchTerm && (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-400 text-base sm:text-lg px-4">
              No members found matching "{searchTerm}"
            </p>
          </div>
        )}

        {/* No Members at all */}
        {!loading && members.length === 0 && !searchTerm && (
          <div className="text-center py-12 sm:py-16">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">No Members Found</h3>
            <p className="text-gray-400 text-base sm:text-lg px-4 mb-8">
              It looks like no members have been added yet or there might be a connection issue.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        )}

        {/* Member Detail Modal */}
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-end sm:items-center justify-center sm:p-4"
            onClick={() => setSelectedMember(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative bg-[#0a0a12] border border-white/10 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-2xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* drag handle on mobile */}
              <div className="flex justify-center pt-3 pb-1 sm:hidden">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>

              {/* ── Responsive layout ── */}
              {/* Mobile: photo hero top + details below | Tablet+: photo left + details right */}
              <div className="flex flex-col sm:flex-row flex-1 min-h-0">

                {/* PHOTO PANEL */}
                {/* Mobile: fixed height hero | sm+: fixed width full height */}
                <div className="relative w-full h-52 sm:h-auto sm:w-52 md:w-64 flex-shrink-0 bg-slate-900">
                  <Image
                    src={selectedMember.photo}
                    alt={selectedMember.name}
                    fill
                    loader={imageLoader}
                    priority
                    className="object-cover object-top"
                    onError={(e) => {
                      const t = e.target as HTMLImageElement
                      t.style.display = 'none'
                      t.nextElementSibling?.classList.remove('hidden')
                    }}
                  />
                  <div className="hidden absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                    <span className="text-white/20 text-5xl font-bold">
                      {selectedMember.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                    </span>
                  </div>

                  {/* bottom gradient */}
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/90 to-transparent" />

                  {/* role badge bottom-left */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border backdrop-blur-sm ${getRoleColor(selectedMember.position)}`}>
                      {selectedMember.position}
                    </span>
                    {/* close btn visible on mobile over photo */}
                    <button
                      onClick={() => setSelectedMember(null)}
                      className="sm:hidden p-1.5 rounded-full bg-black/60 text-gray-300 hover:text-white transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* accent bar — left on desktop, top on mobile */}
                  <div className={`absolute sm:top-0 sm:left-0 sm:w-1 sm:h-full top-0 left-0 right-0 h-1 sm:h-auto ${
                    ['president','chairman','secretary','treasurer'].some(p => selectedMember.position.toLowerCase().includes(p))
                      ? 'bg-gradient-to-r sm:bg-gradient-to-b from-yellow-400 to-orange-500'
                      : selectedMember.position.toLowerCase().includes('team leader')
                      ? 'bg-gradient-to-r sm:bg-gradient-to-b from-indigo-400 to-blue-500'
                      : 'bg-gradient-to-r sm:bg-gradient-to-b from-cyan-400 to-teal-500'
                  }`} />
                </div>

                {/* DETAILS PANEL */}
                <div className="flex-1 overflow-y-auto overscroll-contain">

                  {/* header */}
                  <div className="flex items-start justify-between px-4 sm:px-5 pt-4 sm:pt-5 pb-2">
                    <div className="min-w-0 pr-2">
                      <h3 className="text-lg sm:text-xl font-bold text-white leading-tight truncate">{selectedMember.name}</h3>
                      {selectedMember.team && selectedMember.team !== 'NA' && (
                        <p className="text-gray-400 text-xs mt-0.5 truncate">{selectedMember.team}</p>
                      )}
                    </div>
                    {/* close btn hidden on mobile (shown on photo), visible on sm+ */}
                    <button
                      onClick={() => setSelectedMember(null)}
                      className="hidden sm:flex p-1.5 rounded-full bg-white/8 text-gray-400 hover:text-white hover:bg-white/15 transition-all flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* social links */}
                  {(selectedMember.socialLinks?.linkedin || selectedMember.socialLinks?.github || selectedMember.socialLinks?.instagram) && (
                    <div className="flex flex-wrap gap-2 px-4 sm:px-5 mb-3" onClick={e => e.stopPropagation()}>
                      {selectedMember.socialLinks?.linkedin && (
                        <a href={selectedMember.socialLinks.linkedin.startsWith('http') ? selectedMember.socialLinks.linkedin : `https://${selectedMember.socialLinks.linkedin}`}
                          target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/15 border border-blue-500/25 text-blue-400 text-xs font-medium hover:bg-blue-600/30 transition-colors">
                          <Linkedin className="w-3 h-3" /> LinkedIn
                        </a>
                      )}
                      {selectedMember.socialLinks?.github && (
                        <a href={selectedMember.socialLinks.github.startsWith('http') ? selectedMember.socialLinks.github : `https://${selectedMember.socialLinks.github}`}
                          target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/8 border border-white/12 text-gray-300 text-xs font-medium hover:bg-white/15 transition-colors">
                          <Github className="w-3 h-3" /> GitHub
                        </a>
                      )}
                      {selectedMember.socialLinks?.instagram && (
                        <a href={selectedMember.socialLinks.instagram.startsWith('http') ? selectedMember.socialLinks.instagram : `https://${selectedMember.socialLinks.instagram}`}
                          target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-600/15 border border-pink-500/25 text-pink-400 text-xs font-medium hover:bg-pink-600/30 transition-colors">
                          <Instagram className="w-3 h-3" /> Instagram
                        </a>
                      )}
                    </div>
                  )}

                  <div className="mx-4 sm:mx-5 h-px bg-white/8 mb-3" />

                  {/* stats */}
                  <div className="px-4 sm:px-5 mb-3 grid grid-cols-3 gap-2">
                    {[
                      { icon: <BookOpen className="w-3.5 h-3.5 text-blue-400" />, label: 'Events', value: selectedMember.eventsParticipated?.length ?? 0 },
                      { icon: <Briefcase className="w-3.5 h-3.5 text-purple-400" />, label: 'Projects', value: selectedMember.projectsParticipated?.length ?? 0 },
                      { icon: <Award className="w-3.5 h-3.5 text-yellow-400" />, label: 'Badges', value: selectedMember.badges?.length ?? 0 },
                    ].map(stat => (
                      <div key={stat.label} className="bg-white/[0.04] rounded-xl p-2.5 text-center border border-white/8 flex flex-col items-center gap-1">
                        {stat.icon}
                        <p className="text-white text-base font-bold leading-none">{stat.value}</p>
                        <p className="text-gray-500 text-[10px]">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* academic */}
                  <div className="px-4 sm:px-5 mb-3">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-2">Academic</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { label: 'Branch', value: selectedMember.branch },
                        { label: 'Year', value: selectedMember.year },
                        { label: 'Division', value: selectedMember.division },
                        { label: 'Roll No', value: selectedMember.rollNo },
                      ].filter(i => i.value).map(item => (
                        <div key={item.label} className="bg-white/[0.04] rounded-lg px-3 py-2 border border-white/8">
                          <p className="text-gray-500 text-[9px] uppercase tracking-wide">{item.label}</p>
                          <p className="text-white text-sm font-semibold mt-0.5">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* DOB */}
                  {selectedMember.dateOfBirth && (
                    <div className="px-4 sm:px-5 mb-3">
                      <div className="bg-white/[0.04] rounded-lg px-3 py-2.5 border border-white/8 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-gray-500 text-[9px] uppercase tracking-wide">Date of Birth</p>
                          <p className="text-white text-sm font-semibold mt-0.5">
                            {new Date(selectedMember.dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                        </div>
                        <span className="text-blue-400 text-xs font-bold bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20 flex-shrink-0 whitespace-nowrap">
                          {Math.floor((Date.now() - new Date(selectedMember.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))} yrs
                        </span>
                      </div>
                    </div>
                  )}

                  {/* skills */}
                  {selectedMember.skills && selectedMember.skills.length > 0 && (
                    <div className="px-4 sm:px-5 mb-3">
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-2">Skills</p>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedMember.skills.map((skill, i) => (
                          <span key={i} className="px-2.5 py-1 bg-blue-500/10 text-blue-300 text-xs rounded-lg border border-blue-500/20">{skill}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* badges */}
                  {selectedMember.badges && selectedMember.badges.length > 0 && (
                    <div className="px-4 sm:px-5 mb-3">
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-2">Badges</p>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedMember.badges.map(badge => (
                          <div key={badge.id} title={badge.description}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-white/10 bg-white/[0.04] text-xs text-gray-300">
                            <span>{badge.icon}</span><span>{badge.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pb-6" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Join Us Section */}
        <div className="mt-12 sm:mt-16 lg:mt-20 text-center">
          <div className="glass-card p-6 sm:p-8 lg:p-12 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl sm:rounded-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Want to Join Our Team?</h2>
            <p className="text-sm sm:text-base text-gray-300 mb-6 sm:mb-8 max-w-xl sm:max-w-2xl mx-auto px-2 sm:px-0 leading-relaxed">
              We're always looking for passionate individuals to join our space exploration journey. 
              Whether you're interested in engineering, research, or outreach, there's a place for you at OrbitX.
            </p>
            <a href="/contact" className="btn-primary inline-block px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-sm sm:text-base">
              Get In Touch
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}