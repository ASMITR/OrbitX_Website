'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Medal, Award, Star, Crown, Zap } from 'lucide-react'
import { getMembers } from '@/lib/db'
import { Member } from '@/lib/types'

interface LeaderboardMember extends Member {
  score: number
  rank: number
}

const BADGE_SCORES = {
  'Event Organizer': 50,
  'Project Leader': 45,
  'Active Contributor': 30,
  'Team Player': 25,
  'Innovation Award': 40,
  'Excellence Award': 35,
  'Participation Award': 15,
  'Newcomer': 10,
  'Mentor': 35,
  'Technical Expert': 30
}

export default function Leaderboard() {
  const [members, setMembers] = useState<LeaderboardMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const allMembers = await getMembers()
        
        const scoredMembers = allMembers
          .filter(member => member.approved)
          .map(member => {
            const score = calculateMemberScore(member)
            return { ...member, score }
          })
          .sort((a, b) => b.score - a.score)
          .map((member, index) => ({ ...member, rank: index + 1 }))

        setMembers(scoredMembers)
      } catch (error) {
        console.error('Error fetching leaderboard:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  const calculateMemberScore = (member: Member): number => {
    return 0
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
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

                  <div className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 text-white font-semibold text-sm">
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
            Badge System & How to Earn Points
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Excellence Tier */}
            <div className="bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-lg p-4">
              <h4 className="font-bold text-red-300 mb-3 flex items-center gap-2">
                🏆 Excellence Tier (55-65 pts)
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Outstanding Leader</span>
                  <span className="text-red-300 font-medium">65 pts</span>
                </div>
                <p className="text-xs text-gray-400 mb-2">Lead multiple successful projects, mentor 5+ members</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Visionary</span>
                  <span className="text-red-300 font-medium">60 pts</span>
                </div>
                <p className="text-xs text-gray-400 mb-2">Propose innovative ideas that get implemented</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Pioneer</span>
                  <span className="text-red-300 font-medium">55 pts</span>
                </div>
                <p className="text-xs text-gray-400">First to explore new technologies or methods</p>
              </div>
            </div>

            {/* Leadership Tier */}
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-4">
              <h4 className="font-bold text-blue-300 mb-3 flex items-center gap-2">
                🚀 Leadership Tier (40-50 pts)
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Event Organizer</span>
                  <span className="text-blue-300 font-medium">50 pts</span>
                </div>
                <p className="text-xs text-gray-400 mb-2">Successfully organize and execute events</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Project Leader</span>
                  <span className="text-blue-300 font-medium">45 pts</span>
                </div>
                <p className="text-xs text-gray-400 mb-2">Lead project teams to completion</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Innovation Award</span>
                  <span className="text-blue-300 font-medium">40 pts</span>
                </div>
                <p className="text-xs text-gray-400">Create breakthrough solutions or concepts</p>
              </div>
            </div>

            {/* Expertise Tier */}
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4">
              <h4 className="font-bold text-green-300 mb-3 flex items-center gap-2">
                🎓 Expertise Tier (28-35 pts)
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Excellence Award</span>
                  <span className="text-green-300 font-medium">35 pts</span>
                </div>
                <p className="text-xs text-gray-400 mb-2">Consistently deliver high-quality work</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Technical Expert</span>
                  <span className="text-green-300 font-medium">35 pts</span>
                </div>
                <p className="text-xs text-gray-400 mb-2">Master technical skills, help others learn</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Research Champion</span>
                  <span className="text-green-300 font-medium">35 pts</span>
                </div>
                <p className="text-xs text-gray-400">Conduct valuable research, publish findings</p>
              </div>
            </div>
          </div>

          {/* Collaboration & Participation Tiers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border border-cyan-500/20 rounded-lg p-4">
              <h4 className="font-bold text-cyan-300 mb-3 flex items-center gap-2">
                🤝 Collaboration Tier (18-25 pts)
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Team Player</span>
                  <span className="text-cyan-300 font-medium">25 pts</span>
                </div>
                <p className="text-xs text-gray-400 mb-1">Work well with others, support team goals</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Collaborator</span>
                  <span className="text-cyan-300 font-medium">25 pts</span>
                </div>
                <p className="text-xs text-gray-400 mb-1">Actively collaborate across teams</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Rising Star</span>
                  <span className="text-cyan-300 font-medium">20 pts</span>
                </div>
                <p className="text-xs text-gray-400">Show exceptional potential and growth</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-lg p-4">
              <h4 className="font-bold text-orange-300 mb-3 flex items-center gap-2">
                🎆 Participation Tier (5-15 pts)
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Participation Award</span>
                  <span className="text-orange-300 font-medium">15 pts</span>
                </div>
                <p className="text-xs text-gray-400 mb-1">Actively participate in events and activities</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Attendance Award</span>
                  <span className="text-orange-300 font-medium">12 pts</span>
                </div>
                <p className="text-xs text-gray-400 mb-1">Maintain excellent attendance record</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Newcomer</span>
                  <span className="text-orange-300 font-medium">10 pts</span>
                </div>
                <p className="text-xs text-gray-400">Welcome badge for new members</p>
              </div>
            </div>
          </div>

          {/* How to Earn Points */}
          <div className="mt-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg p-4">
            <h4 className="font-bold text-purple-300 mb-3 flex items-center gap-2">
              ✨ How to Earn Badges
            </h4>
            <div className="grid grid-cols-1 gap-4 text-sm text-gray-300">
              <div>
                <h5 className="font-semibold text-white mb-2">Active Participation:</h5>
                <ul className="space-y-1 text-xs">
                  <li>• Join events and workshops regularly</li>
                  <li>• Contribute to project discussions</li>
                  <li>• Share knowledge with team members</li>
                  <li>• Attend meetings consistently</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-white mb-2">Leadership & Innovation:</h5>
                <ul className="space-y-1 text-xs">
                  <li>• Propose and lead new initiatives</li>
                  <li>• Mentor junior members</li>
                  <li>• Solve complex technical challenges</li>
                  <li>• Organize successful events</li>
                </ul>
              </div>
            </div>
            <div className="mt-3 p-3 bg-blue-500/10 rounded-lg">
              <p className="text-xs text-blue-300">
                💡 <strong>Pro Tip:</strong> Badges are awarded by admins based on your contributions and achievements. Focus on consistent participation and helping others to earn recognition!
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}