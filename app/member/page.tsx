'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useAuthState } from 'react-firebase-hooks/auth'
import { User, Settings, Plus, X, Save, Award, Calendar, Briefcase, Mail, Phone, MapPin, Edit3, Github, Linkedin, Instagram, Camera, Upload } from 'lucide-react'
import { auth } from '@/lib/firebase'
import { getMember, getMemberByEmail, createMemberFromAuth, updateMemberSkills, updateMemberProfile, updateMember } from '@/lib/db'
import { useCloudinaryUpload } from '@/lib/useCloudinaryUpload'
import { BRANCHES, YEARS, DIVISIONS, TEAMS, POSITIONS } from '@/lib/constants'
import { Member } from '@/lib/types'
import toast from 'react-hot-toast'

export default function MemberPanel() {
  const [user] = useAuthState(auth)
  const [member, setMember] = useState<Member | null>(null)
  const [loading, setLoading] = useState(true)
  const { uploadFile } = useCloudinaryUpload()
  const [editingSkills, setEditingSkills] = useState(false)
  const [editingProfile, setEditingProfile] = useState(false)
  const [editingPersonal, setEditingPersonal] = useState(false)
  const [newSkill, setNewSkill] = useState('')
  const [skills, setSkills] = useState<string[]>([])
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string>('')
  const [uploading, setUploading] = useState(false)
  const [profileData, setProfileData] = useState({
    name: '',
    linkedin: '',
    github: '',
    instagram: ''
  })
  const [personalData, setPersonalData] = useState({
    name: '',
    phone: '',
    dateOfBirth: '',
    branch: '',
    year: '',
    division: '',
    rollNo: '',
    zprnNo: ''
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

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
          setPersonalData({
            name: memberData?.name || '',
            phone: memberData?.phone || '',
            dateOfBirth: memberData?.dateOfBirth || '',
            branch: memberData?.branch || '',
            year: memberData?.year || '',
            division: memberData?.division || '',
            rollNo: memberData?.rollNo || '',
            zprnNo: memberData?.zprnNo || ''
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

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size must be less than 2MB')
        return
      }
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        toast.error('Only JPG and PNG files are allowed')
        return
      }
      setProfilePhoto(file)
      const reader = new FileReader()
      reader.onload = () => setPhotoPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const uploadPhoto = async () => {
    if (!profilePhoto || !member) return
    
    setUploading(true)
    try {
      const uploadResult = await uploadFile(profilePhoto, 'members')
      await updateMember(member.id, { photo: uploadResult.secure_url })
      setMember({ ...member, photo: uploadResult.secure_url })
      setProfilePhoto(null)
      setPhotoPreview('')
      toast.success('Profile photo updated successfully!')
    } catch (error) {
      toast.error('Failed to upload photo')
    } finally {
      setUploading(false)
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

  const savePersonalData = async () => {
    if (!member || !user) return
    
    // Validate required fields
    if (!personalData.name || !personalData.dateOfBirth || !personalData.branch || 
        !personalData.year || !personalData.division || !personalData.rollNo || !personalData.zprnNo) {
      toast.error('Please fill in all required fields')
      return
    }
    
    try {
      const completeProfileData = {
        ...personalData,
        team: member.team,
        position: member.position,
        socialLinks: {
          linkedin: profileData.linkedin,
          github: profileData.github,
          instagram: profileData.instagram
        },
        skills: skills,
        approved: false, // Reset to pending for owner approval
        profileCompleted: true,
        submittedForApproval: true,
        submittedAt: new Date().toISOString()
      }
      
      await updateMember(member.id, completeProfileData)
      setMember({ ...member, ...completeProfileData })
      setEditingPersonal(false)
      toast.success('Profile submitted for owner approval successfully!')
    } catch (error) {
      toast.error('Failed to submit profile for approval')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400">Please sign in to access the member panel.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative pt-16 sm:pt-20 lg:pt-24 px-4 sm:px-6 lg:px-8 min-h-screen overflow-x-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 rounded-full bg-gradient-to-r from-blue-500/15 to-purple-500/15 blur-3xl"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-64 sm:h-64 lg:w-96 lg:h-96 rounded-full bg-gradient-to-r from-purple-500/15 to-pink-500/15 blur-3xl"
        />
        
        {/* Floating particles */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-orange-400/60 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1.2, 0.5]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 relative"
        >
          {/* Orbital particles around header */}
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 sm:w-3 sm:h-3 rounded-full"
              style={{
                background: `linear-gradient(45deg, ${i % 2 ? '#f97316' : '#dc2626'}, ${i % 2 ? '#ea580c' : '#b91c1c'})`,
                left: `${20 + (i * 12)}%`,
                top: `${20 + (i % 2) * 30}%`
              }}
              animate={{
                y: [0, -15, 0],
                x: [0, Math.sin(i) * 10, 0],
                opacity: [0.4, 1, 0.4],
                scale: [0.6, 1.2, 0.6],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 2.5 + (i * 0.3),
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
          
          <motion.h1 
            className="heading-xl font-bold mb-4 sm:mb-6 text-center break-words"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              background: 'linear-gradient(90deg, #f97316, #dc2626, #ea580c, #f97316)',
              backgroundSize: '200% 100%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Member Portal
          </motion.h1>
          
          <motion.p 
            className="text-lg-responsive text-gray-300 max-w-4xl mx-auto leading-relaxed mb-6 sm:mb-8 text-center px-2"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            Your gateway to the cosmos. Manage your profile, showcase your skills, and track your journey with OrbitX.
          </motion.p>
          
          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="mt-8"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="cursor-pointer"
            >
              <div className="w-6 h-10 border-2 border-white/40 rounded-full mx-auto relative overflow-hidden">
                <motion.div 
                  className="w-1 h-3 bg-gradient-to-b from-orange-400 to-red-400 rounded-full mx-auto mt-2"
                  animate={{
                    y: [0, 12, 0],
                    opacity: [1, 0.3, 1]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Complete Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 w-full overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h3 className="heading-sm font-bold text-white flex items-center break-words">
              <User className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 text-orange-400 flex-shrink-0" />
              <span className="break-words">Profile Information</span>
            </h3>
            <button
              onClick={() => setEditingPersonal(!editingPersonal)}
              className="btn-primary flex items-center text-sm sm:text-base whitespace-nowrap"
            >
              <Edit3 className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="hidden sm:inline">{editingPersonal ? 'Cancel' : 'Edit Profile'}</span>
              <span className="sm:hidden">{editingPersonal ? 'Cancel' : 'Edit'}</span>
            </button>
          </div>

          {editingPersonal ? (
            <form onSubmit={(e) => { e.preventDefault(); savePersonalData(); }} className="space-y-4 sm:space-y-6 w-full">
              {/* Profile Photo Section */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <img
                    src={photoPreview || member?.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(personalData.name || user?.displayName || 'User')}&background=3b82f6&color=ffffff&size=200`}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-orange-400/30"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 bg-orange-500 hover:bg-orange-600 rounded-full p-3 transition-colors shadow-lg"
                  >
                    <Camera className="w-5 h-5 text-white" />
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <p className="text-xs text-gray-400 mt-2">JPG, PNG up to 2MB</p>
                {profilePhoto && (
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={uploadPhoto}
                      disabled={uploading}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center gap-2 mx-auto"
                    >
                      {uploading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      {uploading ? 'Uploading...' : 'Upload Photo'}
                    </button>
                  </div>
                )}
              </div>

              {/* Personal Information */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                  Personal Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={personalData.name}
                      onChange={(e) => setPersonalData({ ...personalData, name: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Date of Birth *</label>
                    <input
                      type="date"
                      value={personalData.dateOfBirth}
                      onChange={(e) => setPersonalData({ ...personalData, dateOfBirth: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Mobile Number</label>
                    <input
                      type="tel"
                      value={personalData.phone}
                      onChange={(e) => setPersonalData({ ...personalData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                      placeholder="Your mobile number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={member?.email || user?.email || ''}
                      disabled
                      className="w-full px-4 py-3 bg-gray-500/20 border border-gray-500/30 rounded-lg text-gray-400 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  Academic Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Branch *</label>
                    <select
                      value={personalData.branch}
                      onChange={(e) => setPersonalData({ ...personalData, branch: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-gray-800 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400"
                      style={{ colorScheme: 'dark' }}
                    >
                      <option value="" className="bg-gray-800 text-gray-400">Select branch</option>
                      <option value="CS" className="bg-gray-800 text-white">CS</option>
                      <option value="IT" className="bg-gray-800 text-white">IT</option>
                      <option value="AIDS" className="bg-gray-800 text-white">AIDS</option>
                      <option value="AIML" className="bg-gray-800 text-white">AIML</option>
                      <option value="ENTC" className="bg-gray-800 text-white">ENTC</option>
                      <option value="ECE" className="bg-gray-800 text-white">ECE</option>
                      <option value="ROBOTICS & AUTOMATION" className="bg-gray-800 text-white">ROBOTICS & AUTOMATION</option>
                      <option value="CIVIL" className="bg-gray-800 text-white">CIVIL</option>
                      <option value="MECHANICAL" className="bg-gray-800 text-white">MECHANICAL</option>
                      <option value="ELECTRICAL" className="bg-gray-800 text-white">ELECTRICAL</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Year *</label>
                      <select
                        value={personalData.year}
                        onChange={(e) => setPersonalData({ ...personalData, year: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-gray-800 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400"
                        style={{ colorScheme: 'dark' }}
                      >
                        <option value="" className="bg-gray-800 text-gray-400">Select year</option>
                        <option value="FE" className="bg-gray-800 text-white">FE</option>
                        <option value="SE" className="bg-gray-800 text-white">SE</option>
                        <option value="TE" className="bg-gray-800 text-white">TE</option>
                        <option value="BE" className="bg-gray-800 text-white">BE</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Division *</label>
                      <select
                        value={personalData.division}
                        onChange={(e) => setPersonalData({ ...personalData, division: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-gray-800 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400"
                        style={{ colorScheme: 'dark' }}
                      >
                        <option value="" className="bg-gray-800 text-gray-400">Select division</option>
                        <option value="A" className="bg-gray-800 text-white">A</option>
                        <option value="B" className="bg-gray-800 text-white">B</option>
                        <option value="C" className="bg-gray-800 text-white">C</option>
                        <option value="D" className="bg-gray-800 text-white">D</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Roll Number *</label>
                    <input
                      type="text"
                      value={personalData.rollNo}
                      onChange={(e) => setPersonalData({ ...personalData, rollNo: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                      placeholder="Your roll number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">ZPRN Number *</label>
                    <input
                      type="text"
                      value={personalData.zprnNo}
                      onChange={(e) => setPersonalData({ ...personalData, zprnNo: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                      placeholder="Your ZPRN number"
                    />
                  </div>
                </div>
              </div>

              {/* Organization Information */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  Organization Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Team *</label>
                    <select
                      value={member?.team || ''}
                      onChange={(e) => setMember(member ? { ...member, team: e.target.value } : null)}
                      required
                      className="w-full px-4 py-3 bg-gray-800 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400"
                      style={{ colorScheme: 'dark' }}
                    >
                      <option value="" className="bg-gray-800 text-gray-400">Select team</option>
                      <option value="Design & Innovation Team" className="bg-gray-800 text-white">Design & Innovation Team</option>
                      <option value="Technical Team" className="bg-gray-800 text-white">Technical Team</option>
                      <option value="Management & Operations Team" className="bg-gray-800 text-white">Management & Operations Team</option>
                      <option value="Public Outreach Team" className="bg-gray-800 text-white">Public Outreach Team</option>
                      <option value="Documentation Team" className="bg-gray-800 text-white">Documentation Team</option>
                      <option value="Social Media & Editing Team" className="bg-gray-800 text-white">Social Media & Editing Team</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Position *</label>
                    <select
                      value={member?.position || 'Member'}
                      onChange={(e) => setMember(member ? { ...member, position: e.target.value } : null)}
                      className="w-full px-4 py-3 bg-gray-800 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400"
                      style={{ colorScheme: 'dark' }}
                    >
                      <option value="" className="bg-gray-800 text-gray-400">Select position</option>
                      <option value="Faculty Coordinator" className="bg-gray-800 text-white">Faculty Coordinator</option>
                      <option value="President" className="bg-gray-800 text-white">President</option>
                      <option value="Vice President" className="bg-gray-800 text-white">Vice President</option>
                      <option value="Secretary" className="bg-gray-800 text-white">Secretary</option>
                      <option value="Treasurer" className="bg-gray-800 text-white">Treasurer</option>
                      <option value="Co-Treasurer" className="bg-gray-800 text-white">Co-Treasurer</option>
                      <option value="Team Lead" className="bg-gray-800 text-white">Team Lead</option>
                      <option value="Core Member" className="bg-gray-800 text-white">Core Member</option>
                      <option value="Member" className="bg-gray-800 text-white">Member</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <div className="w-2 h-2 bg-pink-400 rounded-full mr-3"></div>
                  Social Links (Optional)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">LinkedIn</label>
                    <input
                      type="url"
                      value={profileData.linkedin}
                      onChange={(e) => setProfileData({ ...profileData, linkedin: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                      placeholder="LinkedIn profile URL"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">GitHub</label>
                    <input
                      type="url"
                      value={profileData.github}
                      onChange={(e) => setProfileData({ ...profileData, github: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                      placeholder="GitHub profile URL"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Instagram</label>
                    <input
                      type="url"
                      value={profileData.instagram}
                      onChange={(e) => setProfileData({ ...profileData, instagram: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                      placeholder="Instagram profile URL"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
                <p className="text-yellow-300 text-sm flex items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                  Your profile will be sent to the owner for approval after submission.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="btn-primary flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Submit for Owner Approval
                </button>
                <button
                  type="button"
                  onClick={() => setEditingPersonal(false)}
                  className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="bg-orange-500/5 backdrop-blur-sm border border-orange-500/20 rounded-lg p-6">
                  <h4 className="text-orange-300 font-semibold mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Personal Information
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div><span className="text-gray-400">Name:</span> <span className="text-white ml-2">{member?.name || 'Not provided'}</span></div>
                    <div><span className="text-gray-400">Email:</span> <span className="text-white ml-2">{member?.email || user?.email}</span></div>
                    <div><span className="text-gray-400">Phone:</span> <span className="text-white ml-2">{member?.phone || 'Not provided'}</span></div>
                    <div><span className="text-gray-400">DOB:</span> <span className="text-white ml-2">{member?.dateOfBirth ? new Date(member.dateOfBirth).toLocaleDateString() : 'Not provided'}</span></div>
                  </div>
                </div>
                
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
                  <h4 className="text-green-300 font-semibold mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Academic Details
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div><span className="text-gray-400">Branch:</span> <span className="text-white ml-2">{member?.branch || 'Not specified'}</span></div>
                    <div><span className="text-gray-400">Year:</span> <span className="text-white ml-2">{member?.year || 'Not specified'}</span></div>
                    <div><span className="text-gray-400">Division:</span> <span className="text-white ml-2">{member?.division || 'Not specified'}</span></div>
                    <div><span className="text-gray-400">Roll No:</span> <span className="text-white ml-2">{member?.rollNo || 'Not specified'}</span></div>
                    <div><span className="text-gray-400">ZPRN:</span> <span className="text-white ml-2">{member?.zprnNo || 'Not specified'}</span></div>
                  </div>
                </div>
              </div>
              
              {/* Right Column */}
              <div className="space-y-6">
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-6">
                  <h4 className="text-purple-300 font-semibold mb-4 flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Organization
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div><span className="text-gray-400">Team:</span> <span className="text-white ml-2">{member?.team || 'Not assigned'}</span></div>
                    <div><span className="text-gray-400">Position:</span> <span className="text-white ml-2">{member?.position || 'Member'}</span></div>
                    <div><span className="text-gray-400">Status:</span> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                        member?.approved === false 
                          ? 'bg-yellow-500/20 text-yellow-300' 
                          : member?.approved === true 
                            ? 'bg-green-500/20 text-green-300'
                            : 'bg-gray-500/20 text-gray-300'
                      }`}>
                        {member?.approved === false ? 'Pending Owner Approval' : member?.approved === true ? 'Approved by Owner' : 'Incomplete Profile'}
                      </span>
                    </div>
                    <div><span className="text-gray-400">Joined:</span> <span className="text-white ml-2">{member?.createdAt ? new Date(member.createdAt).toLocaleDateString() : 'Recently'}</span></div>
                  </div>
                </div>
                
                <div className="bg-pink-500/10 border border-pink-500/20 rounded-lg p-6">
                  <h4 className="text-pink-300 font-semibold mb-4 flex items-center">
                    <Github className="h-5 w-5 mr-2" />
                    Social Links
                  </h4>
                  <div className="space-y-3">
                    {member?.socialLinks?.linkedin ? (
                      <a href={member.socialLinks.linkedin.startsWith('http') ? member.socialLinks.linkedin : `https://${member.socialLinks.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-orange-400 hover:text-orange-300 transition-colors">
                        <Linkedin className="h-4 w-4" />
                        LinkedIn Profile
                      </a>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Linkedin className="h-4 w-4" />
                        No LinkedIn added
                      </div>
                    )}
                    {member?.socialLinks?.github ? (
                      <a href={member.socialLinks.github.startsWith('http') ? member.socialLinks.github : `https://${member.socialLinks.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors">
                        <Github className="h-4 w-4" />
                        GitHub Profile
                      </a>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Github className="h-4 w-4" />
                        No GitHub added
                      </div>
                    )}
                    {member?.socialLinks?.instagram ? (
                      <a href={member.socialLinks.instagram.startsWith('http') ? member.socialLinks.instagram : `https://${member.socialLinks.instagram}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-pink-400 hover:text-pink-300 transition-colors">
                        <Instagram className="h-4 w-4" />
                        Instagram Profile
                      </a>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Instagram className="h-4 w-4" />
                        No Instagram added
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>



        {/* Approval Status */}
        {member?.approved === false && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6 mb-8"
          >
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
              <h3 className="text-lg font-semibold text-yellow-300">Pending Approval</h3>
            </div>
            <p className="text-yellow-200 mt-2">
              Your membership application is under review. You'll receive full access once approved by the admin.
            </p>
          </motion.div>
        )}

        {/* Contact & Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8"
        >
          {/* Stats Cards */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3 sm:p-4 lg:p-6 text-center">
            <Award className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-400 mx-auto mb-1 sm:mb-2" />
            <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white mb-1 break-words">Badges</h3>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-400">{member?.badges?.length || 0}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center">
            <Calendar className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <h3 className="text-lg font-bold text-white mb-1">Events</h3>
            <p className="text-2xl font-bold text-green-400">{member?.eventsParticipated?.length || 0}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center">
            <Briefcase className="h-8 w-8 text-purple-400 mx-auto mb-2" />
            <h3 className="text-lg font-bold text-white mb-1">Projects</h3>
            <p className="text-2xl font-bold text-purple-400">{member?.projectsParticipated?.length || 0}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center">
            <User className="h-8 w-8 text-orange-400 mx-auto mb-2" />
            <h3 className="text-lg font-bold text-white mb-1">Skills</h3>
            <p className="text-2xl font-bold text-orange-400">{member?.skills?.length || 0}</p>
          </div>
        </motion.div>

        {/* Skills Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 w-full overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
            <h3 className="heading-sm font-bold text-white break-words">Skills & Expertise</h3>
            <button
              onClick={() => setEditingSkills(!editingSkills)}
              className="btn-primary flex items-center text-sm sm:text-base whitespace-nowrap"
            >
              <Settings className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="hidden sm:inline">{editingSkills ? 'Cancel' : 'Edit Skills'}</span>
              <span className="sm:hidden">{editingSkills ? 'Cancel' : 'Edit'}</span>
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
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Skills List */}
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-1 px-3 py-2 bg-orange-500/20 text-orange-300 rounded-full border border-orange-500/30">
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
                <span key={index} className="px-3 py-2 bg-orange-500/20 text-orange-300 rounded-full border border-orange-500/30">
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
          transition={{ delay: 0.5 }}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 mb-8"
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
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"
        >
          {/* Events Participated */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
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
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
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