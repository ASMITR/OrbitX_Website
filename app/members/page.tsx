'use client'

import { useState, useEffect, useMemo, useCallback, memo } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Search, Filter, Linkedin, Github, Instagram, X } from 'lucide-react'
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
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedMember(null)}
          >
            <motion.div
              initial={{ 
                opacity: 0, 
                scale: 0.3, 
                rotateY: -90, 
                z: -1000,
                filter: "blur(10px)"
              }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                rotateY: 0, 
                z: 0,
                filter: "blur(0px)",
                transition: {
                  type: "spring",
                  damping: 15,
                  stiffness: 300,
                  duration: 0.3
                }
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.3, 
                rotateY: 90, 
                z: -1000,
                filter: "blur(10px)",
                transition: { duration: 0.2 }
              }}
              whileHover={{ 
                scale: 1.01,
                rotateX: 1,
                y: -5,
                boxShadow: "0 25px 50px rgba(6, 182, 212, 0.3)",
                transition: { duration: 0.3 }
              }}
              className="bg-black/20 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 max-w-5xl w-full max-h-[95vh] overflow-y-auto relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              style={{ 
                perspective: 1500,
                transformStyle: 'preserve-3d'
              }}
            >
              {/* Holographic grid overlay */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden">
                <motion.div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px'
                  }}
                  animate={{
                    backgroundPosition: ['0px 0px', '20px 20px']
                  }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute inset-0 opacity-20"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)'
                  }}
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
              </div>
              {/* Futuristic data streams */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                {[...Array(15)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent"
                    style={{ left: Math.random() * 100 + '%' }}
                    animate={{
                      opacity: [0, 1, 0],
                      scaleY: [0, 1, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                      ease: "easeInOut"
                    }}
                  />
                ))}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={`hex-${i}`}
                    className="absolute w-12 h-12 border border-white/10"
                    style={{
                      left: Math.random() * 90 + '%',
                      top: Math.random() * 90 + '%',
                      clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)'
                    }}
                    animate={{
                      rotate: [0, 360],
                      scale: [0.8, 1.2, 0.8],
                      opacity: [0.1, 0.3, 0.1]
                    }}
                    transition={{
                      duration: 8 + i,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                ))}
              </div>
              {/* Header */}
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="flex justify-between items-center mb-6"
              >
                <motion.div
                  initial={{ x: -20 }}
                  animate={{ x: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold text-white/90">Member Profile</h2>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="h-0.5 bg-white/30 rounded-full mt-1"
                  />
                </motion.div>
                <motion.button
                  initial={{ scale: 0, rotate: -360, opacity: 0 }}
                  animate={{ 
                    scale: 1, 
                    rotate: 0, 
                    opacity: 1,
                    transition: {
                      type: "spring",
                      damping: 8,
                      stiffness: 400,
                      delay: 0.8
                    }
                  }}
                  whileHover={{ 
                    scale: 1.2, 
                    rotate: [0, -10, 10, 0],
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    boxShadow: "0 0 20px rgba(239, 68, 68, 0.5)",
                    transition: { duration: 0.3 }
                  }}
                  whileTap={{ 
                    scale: 0.8,
                    rotate: 180,
                    transition: { duration: 0.1 }
                  }}
                  onClick={() => setSelectedMember(null)}
                  className="p-2 text-gray-400 hover:text-white rounded-xl transition-all duration-200 border border-white/10 hover:border-white/30 relative overflow-hidden group backdrop-blur-sm"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                  <motion.div
                    animate={{ rotate: [0, 180, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    <X className="h-5 w-5 relative z-10" />
                  </motion.div>
                </motion.button>
              </motion.div>

              <div className="flex flex-col lg:flex-row gap-6">
                {/* Photo Section */}
                <motion.div 
                  initial={{ opacity: 0, x: -30, rotateY: -20 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  transition={{ delay: 0.1, duration: 0.3, type: "spring" }}
                  className="flex-shrink-0 text-center lg:text-left"
                >
                  <div className="relative inline-block">
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0, rotateX: 45, rotateY: -30 }}
                      animate={{ 
                        scale: 1, 
                        opacity: 1, 
                        rotateX: 0, 
                        rotateY: 0,
                        transition: {
                          type: "spring",
                          damping: 12,
                          stiffness: 200,
                          delay: 0.3
                        }
                      }}
                      whileHover={{
                        scale: 1.05,
                        rotateY: 5,
                        rotateX: -5,
                        transition: { duration: 0.3 }
                      }}
                      className="w-40 h-48 lg:w-48 lg:h-60 rounded-2xl border-2 border-cyan-500/30 shadow-2xl shadow-cyan-500/20 overflow-hidden mx-auto lg:mx-0 relative cursor-pointer"
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      {/* Glowing border animation */}
                      <motion.div
                        className="absolute inset-0 rounded-2xl"
                        animate={{
                          boxShadow: [
                            '0 0 20px rgba(6, 182, 212, 0.3)',
                            '0 0 40px rgba(6, 182, 212, 0.6)',
                            '0 0 20px rgba(6, 182, 212, 0.3)'
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <Image
                        src={selectedMember.photo}
                        alt={selectedMember.name}
                        width={192}
                        height={240}
                        loader={imageLoader}
                        priority
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          target.nextElementSibling?.classList.remove('hidden')
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                    </motion.div>
                    <div className="hidden w-40 h-48 lg:w-48 lg:h-60 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border-2 border-cyan-500/30 shadow-2xl">
                      <span className="text-6xl opacity-30">👤</span>
                    </div>
                    {/* Advanced floating elements */}
                    <motion.div 
                      animate={{ 
                        scale: [1, 1.5, 1], 
                        opacity: [0.7, 1, 0.7],
                        rotate: [0, 180, 360],
                        x: [0, 5, 0],
                        y: [0, -5, 0]
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute -top-3 -right-3 w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full shadow-lg shadow-cyan-400/50"
                    />
                    <motion.div 
                      animate={{ 
                        scale: [1, 1.3, 1], 
                        opacity: [0.5, 1, 0.5],
                        rotate: [360, 180, 0],
                        x: [0, -3, 0],
                        y: [0, 3, 0]
                      }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: 0.5, ease: "easeInOut" }}
                      className="absolute -bottom-3 -left-3 w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full shadow-lg shadow-purple-400/50"
                    />
                    {/* Orbiting particles */}
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1.5 h-1.5 bg-cyan-300 rounded-full"
                        animate={{
                          rotate: [0, 360],
                          scale: [0.5, 1, 0.5]
                        }}
                        transition={{
                          duration: 4 + i,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                        style={{
                          left: '50%',
                          top: '50%',
                          transformOrigin: `${60 + i * 20}px 0px`
                        }}
                      />
                    ))}
                  </div>
                </motion.div>

                {/* Details Section */}
                <motion.div 
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="flex-1 space-y-4 relative"
                >
                  {/* Scroll-triggered animations */}
                  <motion.div
                    className="absolute -inset-4 bg-gradient-to-r from-cyan-500/5 via-blue-500/10 to-emerald-500/5 rounded-2xl"
                    animate={{
                      opacity: [0.3, 0.7, 0.3],
                      scale: [0.98, 1.02, 0.98]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  {/* Name and Role */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                  >
                    <motion.h3 
                      initial={{ scale: 0.5, opacity: 0, y: 20 }}
                      animate={{ 
                        scale: 1, 
                        opacity: 1, 
                        y: 0,
                        transition: {
                          type: "spring",
                          damping: 10,
                          stiffness: 200,
                          delay: 0.5
                        }
                      }}
                      whileHover={{
                        scale: 1.05,
                        textShadow: "0px 0px 8px rgba(6, 182, 212, 0.8)",
                        transition: { duration: 0.2 }
                      }}
                      className="text-3xl font-bold mb-3 text-white/90 whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer"
                    >
                      <motion.span
                        animate={{
                          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                        style={{
                          backgroundSize: '200% 200%'
                        }}
                      >
                        {selectedMember.name}
                      </motion.span>
                    </motion.h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <motion.span 
                        initial={{ scale: 0, rotate: -180, opacity: 0 }}
                        animate={{ 
                          scale: 1, 
                          rotate: 0, 
                          opacity: 1,
                          transition: {
                            type: "spring",
                            damping: 8,
                            stiffness: 300,
                            delay: 0.6
                          }
                        }}
                        whileHover={{ 
                          scale: 1.1, 
                          y: -3,
                          rotate: [0, -2, 2, 0],
                          transition: { duration: 0.3 }
                        }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-3 py-1.5 rounded-full text-sm font-semibold ${getRoleColor(selectedMember.position)} border shadow-lg cursor-pointer relative overflow-hidden`}
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          initial={{ x: '-100%' }}
                          whileHover={{ x: '100%' }}
                          transition={{ duration: 0.6 }}
                        />
                        <span className="relative z-10">{selectedMember.position}</span>
                      </motion.span>
                      {selectedMember.team && selectedMember.team !== 'NA' && (
                        <motion.span 
                          initial={{ scale: 0, rotate: 180, opacity: 0 }}
                          animate={{ 
                            scale: 1, 
                            rotate: 0, 
                            opacity: 1,
                            transition: {
                              type: "spring",
                              damping: 8,
                              stiffness: 300,
                              delay: 0.7
                            }
                          }}
                          whileHover={{ 
                            scale: 1.1, 
                            y: -3,
                            boxShadow: "0 10px 25px rgba(6, 182, 212, 0.4)",
                            transition: { duration: 0.3 }
                          }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-1.5 rounded-full text-sm bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-lg cursor-pointer relative overflow-hidden"
                        >
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"
                            initial={{ x: '-100%' }}
                            whileHover={{ x: '100%' }}
                            transition={{ duration: 0.6 }}
                          />
                          <span className="relative z-10">{selectedMember.team}</span>
                        </motion.span>
                      )}
                    </div>
                  </motion.div>

                  {/* Personal Info */}
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    whileInView={{ 
                      boxShadow: "0 0 30px rgba(6, 182, 212, 0.2)",
                      borderColor: "rgba(6, 182, 212, 0.4)"
                    }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 relative overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.h4 
                      initial={{ x: -10 }}
                      animate={{ x: 0 }}
                      whileInView={{ 
                        textShadow: "0 0 10px rgba(6, 182, 212, 0.5)"
                      }}
                      transition={{ delay: 0.4 }}
                      className="text-lg font-semibold text-white mb-3 flex items-center relative z-10"
                    >
                      <motion.div 
                        animate={{ 
                          scale: [1, 1.3, 1],
                          boxShadow: [
                            '0 0 5px rgba(6, 182, 212, 0.5)',
                            '0 0 15px rgba(6, 182, 212, 0.8)',
                            '0 0 5px rgba(6, 182, 212, 0.5)'
                          ]
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-2 h-2 bg-white/50 rounded-full mr-3"
                      />
                      Personal Information
                    </motion.h4>
                    <div className="grid grid-cols-1 gap-4 text-sm">
                      {selectedMember.dateOfBirth && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 }}
                          className="bg-white/5 rounded-lg p-3"
                        >
                          <span className="text-gray-400 text-xs uppercase tracking-wide">Date of Birth</span>
                          <p className="text-white font-medium text-lg">
                            {new Date(selectedMember.dateOfBirth).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                          <p className="text-blue-400 text-xs mt-1">
                            Age: {Math.floor((new Date().getTime() - new Date(selectedMember.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))} years
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>

                  {/* Academic Info */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white/5 rounded-2xl p-6 border border-white/10"
                  >
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                      Academic Information
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {[
                        { label: 'Branch', value: selectedMember.branch },
                        { label: 'Year', value: selectedMember.year },
                        { label: 'Division', value: selectedMember.division },
                        { label: 'Roll No', value: selectedMember.rollNo }
                      ].map((item, index) => (
                        <motion.div
                          key={item.label}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + index * 0.1 }}
                          className="bg-white/5 rounded-lg p-3"
                        >
                          <span className="text-gray-400 text-xs uppercase tracking-wide">{item.label}</span>
                          <p className="text-white font-medium text-lg">{item.value}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>



                  {/* Skills */}
                  {selectedMember.skills && selectedMember.skills.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="bg-white/5 rounded-2xl p-6 border border-white/10"
                    >
                      <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                        Skills & Expertise
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedMember.skills.map((skill, index) => (
                          <span key={index} className="px-3 py-2 bg-blue-500/20 text-blue-300 text-sm rounded-full border border-blue-500/30 hover:bg-blue-500/30 transition-colors">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Social Links */}
                  {(selectedMember.socialLinks?.linkedin || selectedMember.socialLinks?.github || selectedMember.socialLinks?.instagram) && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                      className="bg-white/5 rounded-2xl p-6 border border-white/10"
                    >
                      <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                        Social Media
                      </h4>
                      <div className="flex space-x-4 relative z-10">
                        {selectedMember.socialLinks?.linkedin && (
                          <motion.a
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            href={selectedMember.socialLinks.linkedin.startsWith('http') ? selectedMember.socialLinks.linkedin : `https://${selectedMember.socialLinks.linkedin}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 bg-blue-600/20 border border-blue-500/30 rounded-xl flex items-center justify-center hover:bg-blue-600/40 transition-all duration-200 shadow-lg"
                          >
                            <Linkedin className="h-6 w-6 text-blue-400" />
                          </motion.a>
                        )}
                        {selectedMember.socialLinks?.github && (
                          <motion.a
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            href={selectedMember.socialLinks.github.startsWith('http') ? selectedMember.socialLinks.github : `https://${selectedMember.socialLinks.github}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 bg-gray-600/20 border border-gray-500/30 rounded-xl flex items-center justify-center hover:bg-gray-600/40 transition-all duration-200 shadow-lg"
                          >
                            <Github className="h-6 w-6 text-gray-400" />
                          </motion.a>
                        )}
                        {selectedMember.socialLinks?.instagram && (
                          <motion.a
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            href={selectedMember.socialLinks.instagram.startsWith('http') ? selectedMember.socialLinks.instagram : `https://${selectedMember.socialLinks.instagram}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 bg-pink-600/20 border border-pink-500/30 rounded-xl flex items-center justify-center hover:bg-pink-600/40 transition-all duration-200 shadow-lg"
                          >
                            <Instagram className="h-6 w-6 text-pink-400" />
                          </motion.a>
                        )}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
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