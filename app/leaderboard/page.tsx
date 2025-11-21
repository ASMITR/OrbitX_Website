'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Medal, Award, Star, Crown, Zap } from 'lucide-react'
import { getMembers } from '@/lib/db'
import { Member } from '@/lib/types'

interface LeaderboardMember extends Member {
  score: number
  rank: number
  scoreBreakdown?: {
    position: number
    badges: number
    events: number
    projects: number
    skills: number
    tenure: number
  }
}

const BADGE_SCORES = {
  // Excellence Tier (55-65 pts)
  'Outstanding Leader': 65,
  'Visionary': 60,
  'Pioneer': 55,
  
  // Leadership Tier (40-50 pts)
  'Event Organizer': 50,
  'Project Leader': 45,
  'Innovation Award': 40,
  
  // Expertise Tier (28-35 pts)
  'Excellence Award': 35,
  'Technical Expert': 35,
  'Research Champion': 35,
  'Mentor': 35,
  'Active Contributor': 30,
  
  // Collaboration Tier (18-25 pts)
  'Team Player': 25,
  'Collaborator': 25,
  'Rising Star': 20,
  
  // Participation Tier (5-15 pts)
  'Participation Award': 15,
  'Attendance Award': 12,
  'Newcomer': 10,
  
  // Additional badges
  'Problem Solver': 30,
  'Creative Thinker': 25,
  'Community Builder': 20,
  'Quick Learner': 15,
  'Reliable': 15,
  'Helpful': 12,
  'Enthusiastic': 10
}

export default function Leaderboard() {
  const [members, setMembers] = useState<LeaderboardMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setError(null)
        const allMembers = await getMembers()
        
        const scoredMembers = allMembers
          .filter((member: Member) => member.approved !== false)
          .filter((member: Member) => !['President', 'Chairman', 'Secretary', 'Treasurer', 'Co-Treasurer'].includes(member.position))
          .map((member: Member) => {
            const score = calculateMemberScore(member)
            const scoreBreakdown = getScoreBreakdown(member)
            return { ...member, score, scoreBreakdown }
          })
          .sort((a: any, b: any) => b.score - a.score)
          .map((member: any, index: number) => ({ ...member, rank: index + 1 }))

        setMembers(scoredMembers)
      } catch (error) {
        console.error('Error fetching leaderboard:', error)
        setError('Failed to load leaderboard data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  const calculateMemberScore = (member: Member): number => {
    let score = 0
    
    // Base score for position
    const positionScores: { [key: string]: number } = {
      'President': 100,
      'Chairman': 90,
      'Secretary': 80,
      'Treasurer': 75,
      'Co-Treasurer': 70,
      'Team Leader': 60,
      'Member': 20
    }
    
    score += positionScores[member.position] || 20
    
    // Badge scores
    if (member.badges && member.badges.length > 0) {
      member.badges.forEach(badge => {
        score += BADGE_SCORES[badge.name as keyof typeof BADGE_SCORES] || 10
      })
    }
    
    // Event participation bonus
    if (member.eventsParticipated && member.eventsParticipated.length > 0) {
      score += member.eventsParticipated.length * 5
    }
    
    // Project participation bonus
    if (member.projectsParticipated && member.projectsParticipated.length > 0) {
      score += member.projectsParticipated.length * 8
    }
    
    // Skills bonus
    if (member.skills && member.skills.length > 0) {
      score += Math.min(member.skills.length * 2, 20) // Max 20 points from skills
    }
    
    // Tenure bonus (if member has been around longer)
    if (member.createdAt) {
      const joinDate = new Date(member.createdAt)
      const now = new Date()
      const monthsActive = Math.floor((now.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24 * 30))
      score += Math.min(monthsActive * 2, 24) // Max 24 points for 12+ months
    }
    
    return Math.max(score, 0)
  }

  const getScoreBreakdown = (member: Member) => {
    const positionScores: { [key: string]: number } = {
      'President': 100, 'Chairman': 90, 'Secretary': 80, 'Treasurer': 75,
      'Co-Treasurer': 70, 'Team Leader': 60, 'Member': 20
    }
    
    const position = positionScores[member.position] || 20
    const badges = member.badges?.reduce((sum, badge) => 
      sum + (BADGE_SCORES[badge.name as keyof typeof BADGE_SCORES] || 10), 0) || 0
    const events = (member.eventsParticipated?.length || 0) * 5
    const projects = (member.projectsParticipated?.length || 0) * 8
    const skills = Math.min((member.skills?.length || 0) * 2, 20)
    
    let tenure = 0
    if (member.createdAt) {
      const monthsActive = Math.floor((Date.now() - new Date(member.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 30))
      tenure = Math.min(monthsActive * 2, 24)
    }
    
    return { position, badges, events, projects, skills, tenure }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-400" />
      case 2: return <Trophy className="w-6 h-6 text-gray-400" />
      case 3: return <Medal className="w-6 h-6 text-amber-600" />
      default: return <Star className="w-5 h-5 text-blue-400" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading leaderboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-white mb-4">Error Loading Leaderboard</h3>
          <p className="text-gray-400 mb-8 max-w-md">{error}</p>
          <button 
            onClick={() => {
              setError(null)
              setLoading(true)
              window.location.reload()
            }}
            className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (members.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-xl font-bold text-white mb-4">No Members Found</h3>
          <p className="text-gray-400 mb-8 max-w-md">
            No approved members found to display on the leaderboard.
          </p>
          <a 
            href="/members"
            className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
          >
            View All Members
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <Trophy className="w-10 h-10 text-yellow-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              OrbitX Leaderboard
            </h1>
            <Trophy className="w-10 h-10 text-yellow-400" />
          </div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Celebrating our most active and contributing members based on badges, participation, and leadership
          </p>
        </motion.div>

        {members.length >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-3 gap-4 mb-12 max-w-4xl mx-auto"
          >
            <div className="flex flex-col items-center order-1">
              <div className="relative mb-4">
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-gray-400 shadow-lg">
                  <img 
                    src={members[1].photo || '/default-avatar.png'} 
                    alt={members[1].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-2 -right-2 bg-gray-400 rounded-full p-2">
                  <Trophy className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-bold text-white text-lg">{members[1].name}</h3>
                <p className="text-gray-400 text-sm">{members[1].team}</p>
                <div className="bg-gradient-to-r from-gray-300 to-gray-500 text-white px-3 py-1 rounded-full text-sm font-semibold mt-2">
                  {members[1].score} pts
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center order-2">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-yellow-400 shadow-2xl">
                  <img 
                    src={members[0].photo || '/default-avatar.png'} 
                    alt={members[0].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-3 -right-3 bg-yellow-400 rounded-full p-3">
                  <Crown className="w-6 h-6 text-yellow-900" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-bold text-white text-xl">{members[0].name}</h3>
                <p className="text-gray-400">{members[0].team}</p>
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full font-bold mt-2">
                  👑 {members[0].score} pts
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center order-3">
              <div className="relative mb-4">
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-amber-600 shadow-lg">
                  <img 
                    src={members[2].photo || '/default-avatar.png'} 
                    alt={members[2].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-2 -right-2 bg-amber-600 rounded-full p-2">
                  <Medal className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-bold text-white text-lg">{members[2].name}</h3>
                <p className="text-gray-400 text-sm">{members[2].team}</p>
                <div className="bg-gradient-to-r from-amber-500 to-amber-700 text-white px-3 py-1 rounded-full text-sm font-semibold mt-2">
                  {members[2].score} pts
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6 text-cyan-400" />
            Complete Rankings
          </h2>
          
          <div className="space-y-2 sm:space-y-3">
            {members.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`relative overflow-hidden rounded-lg transition-all duration-200 hover:bg-white/5 ${
                  member.rank <= 3 ? 'bg-gradient-to-r from-white/10 to-transparent border border-white/20' : 'bg-white/5'
                }`}
              >
                {/* Mobile Layout */}
                <div className="block sm:hidden p-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-gray-700 to-gray-800 flex-shrink-0">
                      <span className="font-bold text-white text-xs">#{member.rank}</span>
                    </div>
                    
                    <div className="flex-shrink-0">
                      {getRankIcon(member.rank)}
                    </div>

                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-600 flex-shrink-0">
                      <img 
                        src={member.photo || '/default-avatar.png'} 
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white text-sm truncate">{member.name}</h3>
                      <p className="text-gray-400 text-xs truncate">{member.team}</p>
                    </div>

                    <div className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 text-white font-semibold text-xs flex-shrink-0">
                      {member.score} pts
                    </div>
                  </div>
                  
                  {/* Mobile badges row */}
                  {member.badges && member.badges.length > 0 && (
                    <div className="flex items-center gap-2 ml-11">
                      <div className="flex items-center gap-1">
                        {member.badges.slice(0, 4).map((badge, i) => (
                          <div
                            key={i}
                            className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-xs"
                            title={badge.name}
                          >
                            🏆
                          </div>
                        ))}
                        {member.badges.length > 4 && (
                          <span className="text-xs text-gray-400 ml-1">+{member.badges.length - 4}</span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">• {member.position}</span>
                    </div>
                  )}
                </div>

                {/* Tablet/Desktop Layout */}
                <div className="hidden sm:flex items-center gap-4 p-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-gray-700 to-gray-800">
                    <span className="font-bold text-white text-base">#{member.rank}</span>
                  </div>

                  <div className="flex-shrink-0">
                    {getRankIcon(member.rank)}
                  </div>

                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-600">
                    <img 
                      src={member.photo || '/default-avatar.png'} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-base truncate">{member.name}</h3>
                    <p className="text-gray-400 text-sm truncate">{member.team} • {member.position}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {member.badges?.slice(0, 3).map((badge, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-xs"
                        title={badge.name}
                      >
                        {badge.icon || '🏆'}
                      </div>
                    ))}
                    {(member.badges?.length || 0) > 3 && (
                      <span className="text-xs text-gray-400">+{(member.badges?.length || 0) - 3}</span>
                    )}
                  </div>

                  <div className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 text-white font-semibold text-sm cursor-help" title={`Position: ${member.scoreBreakdown?.position || 0} | Badges: ${member.scoreBreakdown?.badges || 0} | Events: ${member.scoreBreakdown?.events || 0} | Projects: ${member.scoreBreakdown?.projects || 0}`}>
                    {member.score} pts
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 glass-card p-6"
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-400" />
            How Points Are Calculated
          </h3>
          
          <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg p-4">
            <h4 className="font-bold text-purple-300 mb-3">Scoring System</h4>
            <div className="text-sm text-gray-300 space-y-2">
              <p><strong>Position:</strong> President (100), Chairman (90), Secretary (80), Treasurer (75), Team Leader (60), Member (20)</p>
              <p><strong>Badges:</strong> Each badge adds 10-65 points based on achievement level</p>
              <p><strong>Participation:</strong> 5 points per event, 8 points per project</p>
              <p><strong>Skills:</strong> 2 points per skill (max 20 points)</p>
              <p><strong>Tenure:</strong> 2 points per month active (max 24 points)</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}