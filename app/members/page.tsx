'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Search, Filter, Linkedin, Github, Instagram, X, BookOpen, Briefcase, Award, Calendar } from 'lucide-react'
import { getMembers } from '@/lib/db'
import { Member } from '@/lib/types'
import { POSITIONS } from '@/lib/constants'
import { imageLoader } from '@/lib/performance'
import { getCache, setCache } from '@/lib/cache'
import { testFirebaseConnection } from '@/lib/firebaseTest'

function FlipCard({ member, accentColor, getRoleColor, onView }: {
  member: Member
  accentColor: string
  getRoleColor: (p: string) => string
  onView: () => void
}) {
  const [flipped, setFlipped] = useState(false)
  const socialUrl = (url: string) => url.startsWith('http') ? url : `https://${url}`

  return (
    <div
      className="relative w-full cursor-pointer"
      style={{ perspective: '1200px', paddingTop: '133.33%' }}
      onClick={() => setFlipped(f => !f)}
    >
      <div
        className="absolute inset-0 transition-transform duration-500"
        style={{ transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        {/* FRONT */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden" style={{ backfaceVisibility: 'hidden' }}>
          <Image
            src={member.photo}
            alt={member.name}
            fill
            loader={imageLoader}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-top"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className={`absolute top-0 left-0 right-0 h-[3px] ${accentColor}`} />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border backdrop-blur-sm ${getRoleColor(member.position)}`}>
              {member.position}
            </span>
            <span className="text-white/50 text-[10px] bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm tracking-wide">tap to flip</span>
          </div>
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden bg-[#07070f] border border-white/10"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className={`absolute top-0 left-0 right-0 h-[3px] ${accentColor}`} />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(99,179,237,0.07),transparent_65%)]" />

          <div className="relative flex flex-col items-center justify-between h-full px-4 pt-6 pb-4 text-center">
            {/* name + role */}
            <div className="w-full">
              <h3 className="text-white font-bold text-base sm:text-lg leading-snug mb-2 line-clamp-2">{member.name}</h3>
              <span className={`inline-block px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold border ${getRoleColor(member.position)}`}>
                {member.position}
              </span>
              {member.team && member.team !== 'NA' && (
                <p className="text-gray-500 text-[10px] mt-2 line-clamp-1 px-1">{member.team}</p>
              )}
            </div>

            <div className="w-10 h-px bg-white/20 my-3" />

            {/* info stack */}
            <div className="w-full flex-1 flex flex-col justify-center gap-3">
              {member.branch && (
                <div className="flex flex-col items-center">
                  <span className="text-gray-500 text-[9px] uppercase tracking-[0.18em] font-semibold">Branch</span>
                  <span className="text-white text-sm sm:text-base font-bold mt-0.5">{member.branch}</span>
                </div>
              )}
              {member.year && (
                <div className="flex flex-col items-center">
                  <span className="text-gray-500 text-[9px] uppercase tracking-[0.18em] font-semibold">Year &amp; Division</span>
                  <span className="text-white text-sm sm:text-base font-bold mt-0.5">{member.year} &ndash; Div {member.division}</span>
                </div>
              )}
              {member.skills && member.skills.length > 0 && (
                <div className="flex flex-col items-center">
                  <span className="text-gray-500 text-[9px] uppercase tracking-[0.18em] font-semibold">Skills</span>
                  <span className="text-gray-300 text-xs mt-0.5 line-clamp-1">{member.skills.slice(0, 3).join(' · ')}</span>
                </div>
              )}
            </div>

            <div className="w-10 h-px bg-white/20 my-3" />

            {/* social icons */}
            <div className="flex justify-center gap-2.5 mb-3" onClick={e => e.stopPropagation()}>
              {member.socialLinks?.linkedin && (
                <a href={socialUrl(member.socialLinks.linkedin)} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-blue-600/15 border border-blue-500/25 flex items-center justify-center hover:bg-blue-600/35 hover:scale-110 transition-all">
                  <Linkedin className="w-4 h-4 text-blue-400" />
                </a>
              )}
              {member.socialLinks?.github && (
                <a href={socialUrl(member.socialLinks.github)} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all">
                  <Github className="w-4 h-4 text-gray-300" />
                </a>
              )}
              {member.socialLinks?.instagram && (
                <a href={socialUrl(member.socialLinks.instagram)} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-pink-600/15 border border-pink-500/25 flex items-center justify-center hover:bg-pink-600/35 hover:scale-110 transition-all">
                  <Instagram className="w-4 h-4 text-pink-400" />
                </a>
              )}
            </div>

            {/* view profile button */}
            <button
              onClick={e => { e.stopPropagation(); onView() }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold tracking-widest hover:from-cyan-500/35 hover:to-blue-500/35 hover:border-cyan-400/50 hover:text-white transition-all"
            >
              VIEW PROFILE &#8594;
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

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
      if (aPos !== bPos) return aPos - bPos
      return a.name.localeCompare(b.name)
    })
  }, [])

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const connectionTest = await testFirebaseConnection()
        if (!connectionTest.success) throw new Error(`Firebase connection failed: ${connectionTest.error}`)
        const cacheKey = 'members_data'
        let membersData = getCache(cacheKey)
        if (!membersData) {
          membersData = await getMembers()
          setCache(cacheKey, membersData, 180000)
        }
        const approvedMembers = membersData.filter((member: Member) => member.approved !== false)
        const sortedMembers = sortMembersByPosition(approvedMembers)
        setMembers(sortedMembers)
        setFilteredMembers(sortedMembers)
      } catch (error: any) {
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
    if (filterTeam !== 'all') filtered = filtered.filter(member => member.team === filterTeam)
    return sortMembersByPosition(filtered)
  }, [searchTerm, filterTeam, members, sortMembersByPosition])

  useEffect(() => { setFilteredMembers(filteredAndSortedMembers) }, [filteredAndSortedMembers])

  const teams = ['Design & Innovation Team', 'Technical Team', 'Management & Operations Team', 'Public Outreach Team', 'Documentation Team', 'Social Media & Editing Team']

  const getRoleColor = (position: string) => {
    if (!position) return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    switch (position.toLowerCase()) {
      case 'president': return 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border-yellow-500/30'
      case 'vice president':
      case 'chairman': return 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30'
      case 'secretary': return 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/30'
      case 'treasurer':
      case 'co-treasurer': return 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30'
      case 'team leader': return 'bg-gradient-to-r from-indigo-500/20 to-blue-500/20 text-indigo-300 border-indigo-500/30'
      case 'member': return 'bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-300 border-gray-500/30'
      default: return 'bg-gradient-to-r from-teal-500/20 to-cyan-500/20 text-teal-300 border-teal-500/30'
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
          <p className="text-gray-400 text-base sm:text-lg px-4 mb-6">{error}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-3">Retry</button>
          <button onClick={() => window.location.reload()} className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">Refresh Page</button>
        </div>
      </div>
    )
  }

  return (
    <>
    <div className="pt-16 sm:pt-20 px-3 sm:px-4 lg:px-6 xl:px-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight">
            Our Team
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-2xl lg:max-w-3xl mx-auto mb-6 sm:mb-8 px-2 sm:px-0 leading-relaxed">
            Meet the passionate individuals who make OrbitX&apos;s mission possible.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-xl sm:max-w-3xl mx-auto px-2 sm:px-0">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
              <input type="text" placeholder="Search members..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors" />
            </div>
            <div className="relative sm:flex-shrink-0">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
              <select value={filterTeam} onChange={(e) => setFilterTeam(e.target.value)}
                className="w-full sm:w-auto pl-9 sm:pl-10 pr-8 py-2.5 sm:py-3 bg-black border border-white/20 rounded-lg text-sm sm:text-base text-white focus:outline-none focus:border-blue-400 transition-colors appearance-none min-w-[180px] sm:min-w-[200px]">
                <option value="all">All Teams</option>
                {teams.map(team => <option key={team} value={team}>{team}</option>)}
              </select>
            </div>
            <a href="/leaderboard" className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all text-sm sm:text-base whitespace-nowrap flex items-center justify-center">
              🏆 Leaderboard
            </a>
          </div>
        </div>

        {/* Leadership */}
        {filteredMembers.filter(m => ['president','chairman','vice president','secretary','treasurer','co-treasurer'].includes(m.position.toLowerCase())).length > 0 && (
          <div className="mb-12 sm:mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Leadership Team</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
              {filteredMembers.filter(m => ['president','chairman','vice president','secretary','treasurer','co-treasurer'].includes(m.position.toLowerCase()))
                .sort((a, b) => {
                  const order = ['president','chairman','vice president','secretary','treasurer','co-treasurer']
                  return (order.indexOf(a.position.toLowerCase()) ?? 99) - (order.indexOf(b.position.toLowerCase()) ?? 99)
                })
                .map(member => <FlipCard key={member.id} member={member} accentColor="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500" getRoleColor={getRoleColor} onView={() => setSelectedMember(member)} />)}
            </div>
          </div>
        )}

        {/* Team Leaders */}
        {filteredMembers.filter(m => m.position.toLowerCase().includes('team lead')).length > 0 && (
          <div className="mb-12 sm:mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">Team Leaders</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-indigo-400 to-blue-400 mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
              {filteredMembers.filter(m => m.position.toLowerCase().includes('team lead'))
                .map(member => <FlipCard key={member.id} member={member} accentColor="bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500" getRoleColor={getRoleColor} onView={() => setSelectedMember(member)} />)}
            </div>
          </div>
        )}

        {/* Members */}
        {filteredMembers.filter(m => !['president','chairman','vice president','secretary','treasurer','co-treasurer'].includes(m.position.toLowerCase()) && !m.position.toLowerCase().includes('team lead')).length > 0 && (
          <div className="mb-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">Members</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-teal-400 mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 mb-8 sm:mb-12">
              {filteredMembers.filter(m => !['president','chairman','vice president','secretary','treasurer','co-treasurer'].includes(m.position.toLowerCase()) && !m.position.toLowerCase().includes('team lead'))
                .map(member => <FlipCard key={member.id} member={member} accentColor="bg-gradient-to-r from-green-500 via-teal-500 to-emerald-500" getRoleColor={getRoleColor} onView={() => setSelectedMember(member)} />)}
            </div>
          </div>
        )}

        {filteredMembers.length === 0 && searchTerm && (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-400 text-base sm:text-lg px-4">No members found matching &quot;{searchTerm}&quot;</p>
          </div>
        )}
        {!loading && members.length === 0 && !searchTerm && (
          <div className="text-center py-12 sm:py-16">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">No Members Found</h3>
            <button onClick={() => window.location.reload()} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Refresh Page</button>
          </div>
        )}

      </div>
    </div>

    {/* Member Modal */}
    {selectedMember && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedMember(null)}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-[#0d0d1a] border border-white/10 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          <div className="relative">
            <div className="h-32 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-t-2xl" />
            <button onClick={() => setSelectedMember(null)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/80 transition-colors">
              <X className="w-4 h-4 text-white" />
            </button>
            <div className="absolute -bottom-12 left-6">
              <div className="w-24 h-24 rounded-2xl border-4 border-[#0d0d1a] overflow-hidden bg-gray-800">
                <Image src={selectedMember.photo} alt={selectedMember.name} width={96} height={96} loader={imageLoader} className="object-cover object-top w-full h-full" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
              </div>
            </div>
          </div>

          <div className="pt-16 px-6 pb-6">
            <h2 className="text-2xl font-bold text-white mb-1">{selectedMember.name}</h2>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border mb-4 ${getRoleColor(selectedMember.position)}`}>{selectedMember.position}</span>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {selectedMember.branch && (
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1"><BookOpen className="w-3.5 h-3.5 text-blue-400" /><span className="text-gray-500 text-xs uppercase tracking-wider">Branch</span></div>
                  <p className="text-white text-sm font-semibold">{selectedMember.branch}</p>
                </div>
              )}
              {selectedMember.year && (
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1"><Calendar className="w-3.5 h-3.5 text-purple-400" /><span className="text-gray-500 text-xs uppercase tracking-wider">Year</span></div>
                  <p className="text-white text-sm font-semibold">{selectedMember.year} – Div {selectedMember.division}</p>
                </div>
              )}
              {selectedMember.team && selectedMember.team !== 'NA' && (
                <div className="bg-white/5 rounded-xl p-3 col-span-2">
                  <div className="flex items-center gap-2 mb-1"><Briefcase className="w-3.5 h-3.5 text-green-400" /><span className="text-gray-500 text-xs uppercase tracking-wider">Team</span></div>
                  <p className="text-white text-sm font-semibold">{selectedMember.team}</p>
                </div>
              )}
            </div>

            {selectedMember.skills && selectedMember.skills.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3"><Award className="w-4 h-4 text-yellow-400" /><span className="text-gray-400 text-sm font-semibold">Skills</span></div>
                <div className="flex flex-wrap gap-2">
                  {selectedMember.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-gray-300 text-xs">{skill}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              {selectedMember.socialLinks?.linkedin && (
                <a href={selectedMember.socialLinks.linkedin.startsWith('http') ? selectedMember.socialLinks.linkedin : `https://${selectedMember.socialLinks.linkedin}`} target="_blank" rel="noopener noreferrer"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600/15 border border-blue-500/25 flex items-center justify-center gap-2 hover:bg-blue-600/30 transition-all">
                  <Linkedin className="w-4 h-4 text-blue-400" /><span className="text-blue-300 text-xs font-semibold">LinkedIn</span>
                </a>
              )}
              {selectedMember.socialLinks?.github && (
                <a href={selectedMember.socialLinks.github.startsWith('http') ? selectedMember.socialLinks.github : `https://${selectedMember.socialLinks.github}`} target="_blank" rel="noopener noreferrer"
                  className="flex-1 py-2.5 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center gap-2 hover:bg-white/20 transition-all">
                  <Github className="w-4 h-4 text-gray-300" /><span className="text-gray-300 text-xs font-semibold">GitHub</span>
                </a>
              )}
              {selectedMember.socialLinks?.instagram && (
                <a href={selectedMember.socialLinks.instagram.startsWith('http') ? selectedMember.socialLinks.instagram : `https://${selectedMember.socialLinks.instagram}`} target="_blank" rel="noopener noreferrer"
                  className="flex-1 py-2.5 rounded-xl bg-pink-600/15 border border-pink-500/25 flex items-center justify-center gap-2 hover:bg-pink-600/30 transition-all">
                  <Instagram className="w-4 h-4 text-pink-400" /><span className="text-pink-300 text-xs font-semibold">Instagram</span>
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    )}
  </>
  )
}
