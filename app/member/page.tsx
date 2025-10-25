'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuthState } from 'react-firebase-hooks/auth'
import { User, Settings, Plus, X, Save, Award, Calendar, Briefcase, Mail, Phone, MapPin, Edit3, Github, Linkedin, Instagram } from 'lucide-react'
import { auth } from '@/lib/firebase'
import { getMember, getMemberByEmail, createMemberFromAuth, updateMemberSkills, updateMemberProfile } from '@/lib/db'
import { Member } from '@/lib/types'
import toast from 'react-hot-toast'

export default function MemberPanel() {
  const [user] = useAuthState(auth)
  const [member, setMember] = useState<Member | null>(null)
  const [loading, setLoading] = useState(true)
  const [editingSkills, setEditingSkills] = useState(false)
  const [editingProfile, setEditingProfile] = useState(false)
  const [newSkill, setNewSkill] = useState('')
  const [skills, setSkills] = useState<string[]>([])
  const [profileData, setProfileData] = useState({
    name: '',
    linkedin: '',
    github: '',
    instagram: ''
  })

  useEffect(() => {
    const fetchMember = async () => {
      if (user?.email) {
        try {
          // First try to find member by UID
          let memberData = await getMember(user.uid)
          
          // If not found by UID, try by email
          if (!memberData) {
            memberData = await getMemberByEmail(user.email)
          }
          
          // If still not found, create a new member record
          if (!memberData) {
            const displayName = user.displayName || user.email.split('@')[0] || 'Member'
            memberData = await createMemberFromAuth(user.uid, user.email, displayName)
            toast.success('Welcome! Your member profile has been created.')
          }
          
          setMember(memberData)
          setSkills(memberData?.skills || [])
          setProfileData({
            name: memberData?.name || '',
            linkedin: memberData?.socialLinks?.linkedin || '',
            github: memberData?.socialLinks?.github || '',
            instagram: memberData?.socialLinks?.instagram || ''
          })
        } catch (error) {
          console.error('Error fetching/creating member:', error)
          toast.error('Failed to load member profile')
        }
      }
      setLoading(false)
    }

    fetchMember()
  }, [user])

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill('')
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove))
  }

  const saveSkills = async () => {
    if (!member || !user) return
    
    try {
      await updateMemberSkills(member.id, skills)
      setMember({ ...member, skills })
      setEditingSkills(false)
      toast.success('Skills updated successfully!')
    } catch (error) {
      toast.error('Failed to update skills')
    }
  }

  const saveProfile = async () => {
    if (!member || !user) return
    
    try {
      const updateData = {
        name: profileData.name,
        socialLinks: {
          linkedin: profileData.linkedin,
          github: profileData.github,
          instagram: profileData.instagram
        }
      }
      await updateMemberProfile(member.id, updateData)
      setMember({ ...member, ...updateData })
      setEditingProfile(false)
      toast.success('Profile updated successfully!')
      
      // Trigger navbar refresh
      window.dispatchEvent(new CustomEvent('profile-updated'))
    } catch (error) {
      toast.error('Failed to update profile')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400">Please sign in to access the member panel.</p>
        </div>
      </div>
    )
  }

  // Member will be automatically created if not found, so this check is no longer needed

  return (
    <div className="pt-20 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Member Panel
          </h1>
          <p className="text-gray-300">Manage your profile and skills</p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 mb-8"
        >
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xl font-bold text-white">Profile Information</h3>
            <button
              onClick={() => setEditingProfile(!editingProfile)}
              className="btn-primary flex items-center"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              {editingProfile ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile Photo */}
            <div className="flex-shrink-0 text-center">
              <img
                src={member?.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name || user?.displayName || 'User')}&background=3b82f6&color=ffffff&size=200`}
                alt={member?.name || 'User'}
                className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-blue-400/30"
              />
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              {editingProfile ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                      placeholder="Enter your name"
                    />
                  </div>
                  <button
                    onClick={saveProfile}
                    className="btn-primary flex items-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Profile
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-white mb-2">{member?.name || user?.displayName || 'Loading...'}</h2>
                  <p className="text-blue-400 mb-2">{member?.position || 'Member'}</p>
                  <p className="text-purple-400 mb-4">{member?.team || 'General'}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Branch:</span>
                      <p className="text-white">{member?.branch || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Year:</span>
                      <p className="text-white">{member?.year || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Division:</span>
                      <p className="text-white">{member?.division || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Roll No:</span>
                      <p className="text-white">{member?.rollNo || 'Not specified'}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Social Media Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-8 mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Social Media Links</h3>
            <button
              onClick={() => setEditingProfile(!editingProfile)}
              className="btn-primary flex items-center"
            >
              <Settings className="h-4 w-4 mr-2" />
              {editingProfile ? 'Cancel' : 'Edit Links'}
            </button>
          </div>

          {editingProfile ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">LinkedIn</label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-5 w-5" />
                  <input
                    type="url"
                    value={profileData.linkedin}
                    onChange={(e) => setProfileData({ ...profileData, linkedin: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">GitHub</label>
                <div className="relative">
                  <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="url"
                    value={profileData.github}
                    onChange={(e) => setProfileData({ ...profileData, github: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                    placeholder="https://github.com/username"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Instagram</label>
                <div className="relative">
                  <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400 h-5 w-5" />
                  <input
                    type="url"
                    value={profileData.instagram}
                    onChange={(e) => setProfileData({ ...profileData, instagram: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                    placeholder="https://instagram.com/username"
                  />
                </div>
              </div>
              <button
                onClick={saveProfile}
                className="btn-primary flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Links
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4">
              {member?.socialLinks?.linkedin && (
                <a
                  href={member.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg border border-blue-500/30 hover:bg-blue-500/30 transition-colors"
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </a>
              )}
              {member?.socialLinks?.github && (
                <a
                  href={member.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-500/20 text-gray-300 rounded-lg border border-gray-500/30 hover:bg-gray-500/30 transition-colors"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
              )}
              {member?.socialLinks?.instagram && (
                <a
                  href={member.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-pink-500/20 text-pink-300 rounded-lg border border-pink-500/30 hover:bg-pink-500/30 transition-colors"
                >
                  <Instagram className="h-4 w-4" />
                  Instagram
                </a>
              )}
              {(!member?.socialLinks?.linkedin && !member?.socialLinks?.github && !member?.socialLinks?.instagram) && (
                <p className="text-gray-400">No social media links added yet. Click "Edit Links" to add some!</p>
              )}
            </div>
          )}
        </motion.div>

        {/* Contact & Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {/* Stats Cards */}
          <div className="glass-card p-6 text-center">
            <Award className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
            <h3 className="text-lg font-bold text-white mb-1">Badges</h3>
            <p className="text-2xl font-bold text-yellow-400">{member?.badges?.length || 0}</p>
          </div>
          <div className="glass-card p-6 text-center">
            <Calendar className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <h3 className="text-lg font-bold text-white mb-1">Events</h3>
            <p className="text-2xl font-bold text-green-400">{member?.eventsParticipated?.length || 0}</p>
          </div>
          <div className="glass-card p-6 text-center">
            <Briefcase className="h-8 w-8 text-purple-400 mx-auto mb-2" />
            <h3 className="text-lg font-bold text-white mb-1">Projects</h3>
            <p className="text-2xl font-bold text-purple-400">{member?.projectsParticipated?.length || 0}</p>
          </div>
        </motion.div>

        {/* Skills Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-8 mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Skills & Expertise</h3>
            <button
              onClick={() => setEditingSkills(!editingSkills)}
              className="btn-primary flex items-center"
            >
              <Settings className="h-4 w-4 mr-2" />
              {editingSkills ? 'Cancel' : 'Edit Skills'}
            </button>
          </div>

          {editingSkills ? (
            <div className="space-y-4">
              {/* Add New Skill */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a new skill..."
                  className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                />
                <button
                  onClick={addSkill}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Skills List */}
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-1 px-3 py-2 bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30">
                    <span>{skill}</span>
                    <button
                      onClick={() => removeSkill(skill)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Save Button */}
              <button
                onClick={saveSkills}
                className="btn-primary flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Skills
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {(member?.skills || []).map((skill, index) => (
                <span key={index} className="px-3 py-2 bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30">
                  {skill}
                </span>
              ))}
              {(!member?.skills || member?.skills.length === 0) && (
                <p className="text-gray-400">No skills added yet. Click "Edit Skills" to add some!</p>
              )}
            </div>
          )}
        </motion.div>

        {/* Badges Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-8 mb-8"
        >
          <div className="flex items-center mb-6">
            <Award className="h-6 w-6 text-yellow-400 mr-3" />
            <h3 className="text-xl font-bold text-white">Achievements & Badges</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {(member?.badges || []).map((badge, index) => (
              <div key={index} className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 text-yellow-300 rounded-lg border border-yellow-500/30">
                <Award className="h-4 w-4" />
                <span className="font-medium">{badge.name}</span>
              </div>
            ))}
            {(!member?.badges || member?.badges.length === 0) && (
              <p className="text-gray-400">No badges earned yet. Participate in events and projects to earn badges!</p>
            )}
          </div>
        </motion.div>

        {/* Activity Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Events Participated */}
          <div className="glass-card p-8">
            <div className="flex items-center mb-6">
              <Calendar className="h-6 w-6 text-green-400 mr-3" />
              <h3 className="text-xl font-bold text-white">Events Participated</h3>
            </div>
            <div className="space-y-3">
              {(member?.eventsParticipated || []).slice(0, 5).map((eventId, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <Calendar className="h-4 w-4 text-green-400" />
                  <span className="text-green-300">Event #{eventId}</span>
                </div>
              ))}
              {(!member?.eventsParticipated || member?.eventsParticipated.length === 0) && (
                <p className="text-gray-400">No events participated yet. Join upcoming events!</p>
              )}
            </div>
          </div>

          {/* Projects Participated */}
          <div className="glass-card p-8">
            <div className="flex items-center mb-6">
              <Briefcase className="h-6 w-6 text-purple-400 mr-3" />
              <h3 className="text-xl font-bold text-white">Projects Participated</h3>
            </div>
            <div className="space-y-3">
              {(member?.projectsParticipated || []).slice(0, 5).map((projectId, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <Briefcase className="h-4 w-4 text-purple-400" />
                  <span className="text-purple-300">Project #{projectId}</span>
                </div>
              ))}
              {(!member?.projectsParticipated || member?.projectsParticipated.length === 0) && (
                <p className="text-gray-400">No projects participated yet. Join exciting projects!</p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}