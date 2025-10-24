'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Award, Calendar, FolderOpen, User, Mail, Phone, MapPin, Linkedin, Github, Instagram, Star, Trophy, Target, TrendingUp, Activity, Clock, Rocket } from 'lucide-react'
import { useAuth } from '@/components/admin/AuthProvider'
import { getMembers, getEvents, getProjects, getBlogs } from '@/lib/db'
import { Member, Event, Project, Blog } from '@/lib/types'
import SpaceBackground from '@/components/SpaceBackground'
import StarField from '@/components/StarField'

export default function MemberDashboard() {
  const { user } = useAuth()
  const [member, setMember] = useState<Member | null>(null)
  const [memberEvents, setMemberEvents] = useState<Event[]>([])
  const [memberProjects, setMemberProjects] = useState<Project[]>([])
  const [memberBlogs, setMemberBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (user?.email) {
      fetchMemberData()
    }
  }, [user])

  const fetchMemberData = async () => {
    try {
      const [members, events, projects, blogs] = await Promise.all([
        getMembers(),
        getEvents(),
        getProjects(),
        getBlogs()
      ])

      const currentMember = members.find(m => m.email === user?.email)
      if (currentMember) {
        setMember(currentMember)
        
        const participatedEvents = events.filter((e: Event) => 
          currentMember.eventsParticipated?.includes(e.id)
        )
        const participatedProjects = projects.filter((p: Project) => 
          currentMember.projectsParticipated?.includes(p.id)
        )
        const authoredBlogs = blogs.filter((b: Blog) => 
          b.author === currentMember.name
        )
        
        setMemberEvents(participatedEvents)
        setMemberProjects(participatedProjects)
        setMemberBlogs(authoredBlogs)
      }
    } catch (error) {
      console.error('Error fetching member data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20">
        <SpaceBackground />
        <StarField />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading your profile...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!member) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20">
        <SpaceBackground />
        <StarField />
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center glass-card p-8 max-w-md"
          >
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Member Not Found</h2>
            <p className="text-gray-400 mb-6">Please contact admin to add you as a member.</p>
            <a href="/contact" className="btn-primary">
              Contact Admin
            </a>
          </motion.div>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: User },
    { id: 'activity', name: 'Activity', icon: Activity },
    { id: 'achievements', name: 'Achievements', icon: Trophy },
    { id: 'profile', name: 'Profile', icon: Star }
  ]

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20">
      <SpaceBackground />
      <StarField />
      
      <div className="relative z-10 pt-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="glass-card p-8 mb-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-400/30"
          >
            <div className="flex flex-col md:flex-row items-center md:items-start">
              <div className="relative mb-6 md:mb-0 md:mr-8">
                <div className="w-32 h-32 rounded-full border-4 border-white/20 shadow-2xl overflow-hidden bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      target.nextElementSibling?.classList.remove('hidden')
                    }}
                  />
                  <div className="hidden w-full h-full flex items-center justify-center">
                    <User className="h-16 w-16 text-gray-400" />
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-gray-900 flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {member.name}
                </h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-4">
                  <span className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium border border-blue-500/30">
                    {member.position}
                  </span>
                  <span className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium border border-purple-500/30">
                    {member.team}
                  </span>
                </div>
                <p className="text-gray-300 mb-4">{member.branch} • {member.year} Year • Division {member.division}</p>
                
                {/* Contact Info */}
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-400">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    <span>{member.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{member.phone}</span>
                  </div>
                </div>
                
                {/* Social Links */}
                {(member.socialLinks?.linkedin || member.socialLinks?.github || member.socialLinks?.instagram) && (
                  <div className="flex justify-center md:justify-start space-x-3 mt-4">
                    {member.socialLinks?.linkedin && (
                      <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-blue-600/20 border border-blue-500/30 rounded-lg flex items-center justify-center hover:bg-blue-600/40 transition-colors">
                        <Linkedin className="h-5 w-5 text-blue-400" />
                      </a>
                    )}
                    {member.socialLinks?.github && (
                      <a href={member.socialLinks.github} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-600/20 border border-gray-500/30 rounded-lg flex items-center justify-center hover:bg-gray-600/40 transition-colors">
                        <Github className="h-5 w-5 text-gray-400" />
                      </a>
                    )}
                    {member.socialLinks?.instagram && (
                      <a href={member.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-pink-600/20 border border-pink-500/30 rounded-lg flex items-center justify-center hover:bg-pink-600/40 transition-colors">
                        <Instagram className="h-5 w-5 text-pink-400" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Navigation Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-2 mb-8"
          >
            <div className="flex flex-wrap justify-center gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-3 rounded-lg transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <tab.icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Stats */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-6 text-center hover:scale-105 transition-transform"
                  >
                    <Award className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white">{member.badges?.length || 0}</h3>
                    <p className="text-gray-400">Badges Earned</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-6 text-center hover:scale-105 transition-transform"
                  >
                    <Calendar className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white">{memberEvents.length}</h3>
                    <p className="text-gray-400">Events Participated</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-6 text-center hover:scale-105 transition-transform"
                  >
                    <FolderOpen className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white">{memberProjects.length}</h3>
                    <p className="text-gray-400">Projects Contributed</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card p-6 text-center hover:scale-105 transition-transform"
                  >
                    <Rocket className="h-12 w-12 text-green-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white">{memberBlogs.length}</h3>
                    <p className="text-gray-400">Blogs Written</p>
                  </motion.div>
                </div>

                {/* Quick Overview */}
                <div className="grid lg:grid-cols-2 gap-8">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="glass-card p-6"
                  >
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Recent Activity
                    </h2>
                    <div className="space-y-3">
                      {[...memberEvents.slice(0, 3), ...memberProjects.slice(0, 2)]
                        .sort((a, b) => new Date(b.date || b.createdAt).getTime() - new Date(a.date || a.createdAt).getTime())
                        .slice(0, 5)
                        .map((item, index) => (
                        <div key={index} className="flex items-center p-3 bg-white/5 rounded-lg">
                          {'date' in item ? (
                            <Calendar className="h-5 w-5 text-blue-400 mr-3" />
                          ) : (
                            <FolderOpen className="h-5 w-5 text-purple-400 mr-3" />
                          )}
                          <div>
                            <p className="text-white font-medium">{item.title}</p>
                            <p className="text-gray-400 text-sm">
                              {new Date(item.date || item.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                      {memberEvents.length === 0 && memberProjects.length === 0 && (
                        <p className="text-gray-400 text-center py-4">No recent activity</p>
                      )}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="glass-card p-6"
                  >
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                      <Target className="h-5 w-5 mr-2" />
                      Member Info
                    </h2>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Roll Number</span>
                        <span className="text-white font-medium">{member.rollNo}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">ZPRN Number</span>
                        <span className="text-white font-medium">{member.zprnNo}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Joined</span>
                        <span className="text-white font-medium">
                          {new Date(member.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {member.dateOfBirth && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Birthday</span>
                          <span className="text-white font-medium">
                            {new Date(member.dateOfBirth).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Events */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass-card p-6"
                >
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Events Participated ({memberEvents.length})
                  </h2>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {memberEvents.map((event) => (
                      <div key={event.id} className="bg-white/10 rounded-lg p-4 hover:bg-white/15 transition-colors">
                        <h3 className="text-white font-medium mb-2">{event.title}</h3>
                        <p className="text-gray-400 text-sm mb-2">{event.description}</p>
                        <div className="flex items-center text-gray-500 text-xs">
                          <Clock className="h-4 w-4 mr-1" />
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                    {memberEvents.length === 0 && (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">No events participated yet</p>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Projects */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass-card p-6"
                >
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                    <FolderOpen className="h-5 w-5 mr-2" />
                    Projects Contributed ({memberProjects.length})
                  </h2>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {memberProjects.map((project) => (
                      <div key={project.id} className="bg-white/10 rounded-lg p-4 hover:bg-white/15 transition-colors">
                        <h3 className="text-white font-medium mb-2">{project.title}</h3>
                        <p className="text-gray-400 text-sm mb-2">{project.description}</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {project.technologies.slice(0, 3).map((tech, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">
                              {tech}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center text-gray-500 text-xs">
                          <Clock className="h-4 w-4 mr-1" />
                          {new Date(project.date).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                    {memberProjects.length === 0 && (
                      <div className="text-center py-8">
                        <FolderOpen className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">No projects contributed yet</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="space-y-8">
                {/* Badges */}
                {member.badges && member.badges.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6"
                  >
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                      <Trophy className="h-6 w-6 mr-2" />
                      Badges & Achievements ({member.badges.length})
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {member.badges.map((badge) => (
                        <motion.div
                          key={badge.id}
                          whileHover={{ scale: 1.05 }}
                          className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg p-6 text-center"
                        >
                          <div className="text-4xl mb-4">{badge.icon}</div>
                          <h3 className="text-white font-bold text-lg mb-2">{badge.name}</h3>
                          <p className="text-gray-300 text-sm mb-3">{badge.description}</p>
                          <div className="text-yellow-400 text-xs">
                            Awarded on {new Date(badge.awardedAt).toLocaleDateString()}
                          </div>
                          <div className="text-gray-500 text-xs mt-1">
                            By {badge.awardedBy}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-12 text-center"
                  >
                    <Trophy className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No Badges Yet</h3>
                    <p className="text-gray-400">Participate in events and projects to earn badges!</p>
                  </motion.div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-8"
              >
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <User className="h-6 w-6 mr-2" />
                  Complete Profile
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Personal Information</label>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                          <span className="text-gray-400">Full Name</span>
                          <span className="text-white font-medium">{member.name}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                          <span className="text-gray-400">Email</span>
                          <span className="text-white font-medium">{member.email}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                          <span className="text-gray-400">Phone</span>
                          <span className="text-white font-medium">{member.phone}</span>
                        </div>
                        {member.dateOfBirth && (
                          <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                            <span className="text-gray-400">Date of Birth</span>
                            <span className="text-white font-medium">
                              {new Date(member.dateOfBirth).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Academic Information</label>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                          <span className="text-gray-400">Branch</span>
                          <span className="text-white font-medium">{member.branch}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                          <span className="text-gray-400">Year</span>
                          <span className="text-white font-medium">{member.year}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                          <span className="text-gray-400">Division</span>
                          <span className="text-white font-medium">{member.division}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                          <span className="text-gray-400">Roll Number</span>
                          <span className="text-white font-medium">{member.rollNo}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                          <span className="text-gray-400">ZPRN Number</span>
                          <span className="text-white font-medium">{member.zprnNo}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}