'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Search, Filter, Linkedin, Github, Instagram, X } from 'lucide-react'
import { getMembers } from '@/lib/db'
import { Member } from '@/lib/types'

export default function Members() {
  const [members, setMembers] = useState<Member[]>([])
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTeam, setFilterTeam] = useState('all')
  const [loading, setLoading] = useState(true)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const membersData = await getMembers()
        // Only show approved members to the public
        const approvedMembers = membersData.filter(member => member.approved !== false)
        setMembers(approvedMembers)
        setFilteredMembers(approvedMembers)
      } catch (error) {
        console.error('Error fetching members:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMembers()
  }, [])

  useEffect(() => {
    let filtered = members.filter(member =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.team.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (filterTeam !== 'all') {
      filtered = filtered.filter(member => member.team === filterTeam)
    }

    setFilteredMembers(filtered)
  }, [searchTerm, filterTeam, members])

  // Sample members data for demonstration
  const sampleMembers: Member[] = [
    {
      id: '1',
      name: 'Dr. Rajesh Kumar',
      branch: 'Computer Science',
      year: 'Faculty',
      division: 'A',
      rollNo: 'FAC001',
      zprnNo: 'ZPR001',
      position: 'Faculty Coordinator',
      team: 'Leadership',
      phone: '+91 98765 43210',
      email: 'rajesh.kumar@orbitx.com',
      photo: '/api/placeholder/200/200',
      dateOfBirth: '1980-05-15',
      socialLinks: {
        linkedin: '#',
        github: '#'
      },
      skills: ['Leadership', 'Project Management', 'Space Technology'],
      createdAt: '2024-01-01'
    },
    {
      id: '2',
      name: 'Arjun Patel',
      branch: 'Mechanical Engineering',
      year: 'Third',
      division: 'B',
      rollNo: 'ME2021001',
      zprnNo: 'ZPR2021001',
      position: 'Team Lead',
      team: 'Design & Innovation Team',
      phone: '+91 98765 43211',
      email: 'arjun.patel@orbitx.com',
      photo: '/api/placeholder/200/200',
      dateOfBirth: '2002-08-22',
      socialLinks: {
        linkedin: '#',
        github: '#',
        instagram: '#'
      },
      skills: ['CAD Design', 'Mechanical Engineering', 'Innovation', 'Prototyping'],
      createdAt: '2024-01-01'
    },
    {
      id: '3',
      name: 'Priya Sharma',
      branch: 'Electronics Engineering',
      year: 'Second',
      division: 'A',
      rollNo: 'EE2022001',
      zprnNo: 'ZPR2022001',
      position: 'Core Member',
      team: 'Design & Innovation Team',
      phone: '+91 98765 43212',
      email: 'priya.sharma@orbitx.com',
      photo: '/api/placeholder/200/200',
      dateOfBirth: '2003-03-10',
      socialLinks: {
        linkedin: '#'
      },
      createdAt: '2024-01-01'
    },
    {
      id: '4',
      name: 'Vikram Singh',
      branch: 'Computer Science',
      year: 'Final',
      division: 'A',
      rollNo: 'CS2020001',
      zprnNo: 'ZPR2020001',
      position: 'Team Lead',
      team: 'Technical Team',
      phone: '+91 98765 43213',
      email: 'vikram.singh@orbitx.com',
      photo: '/api/placeholder/200/200',
      dateOfBirth: '2001-11-05',
      socialLinks: {
        linkedin: '#',
        github: '#'
      },
      createdAt: '2024-01-01'
    },
    {
      id: '5',
      name: 'Anita Rao',
      branch: 'Information Technology',
      year: 'Third',
      division: 'B',
      rollNo: 'IT2021002',
      zprnNo: 'ZPR2021002',
      position: 'Core Member',
      team: 'Technical Team',
      phone: '+91 98765 43214',
      email: 'anita.rao@orbitx.com',
      photo: '/api/placeholder/200/200',
      dateOfBirth: '2002-07-18',
      socialLinks: {
        linkedin: '#',
        instagram: '#'
      },
      createdAt: '2024-01-01'
    },
    {
      id: '6',
      name: 'Rajesh Gupta',
      branch: 'Management Studies',
      year: 'Final',
      division: 'A',
      rollNo: 'MS2020001',
      zprnNo: 'ZPR2020002',
      position: 'Team Lead',
      team: 'Management & Operations Team',
      phone: '+91 98765 43215',
      email: 'rajesh.gupta@orbitx.com',
      photo: '/api/placeholder/200/200',
      dateOfBirth: '2001-12-03',
      socialLinks: {
        linkedin: '#',
        github: '#'
      },
      createdAt: '2024-01-01'
    },
    {
      id: '7',
      name: 'Kavya Menon',
      branch: 'Business Administration',
      year: 'Second',
      division: 'B',
      rollNo: 'BA2022001',
      zprnNo: 'ZPR2022002',
      position: 'Core Member',
      team: 'Management & Operations Team',
      phone: '+91 98765 43216',
      email: 'kavya.menon@orbitx.com',
      photo: '/api/placeholder/200/200',
      dateOfBirth: '2003-01-25',
      socialLinks: {
        linkedin: '#'
      },
      createdAt: '2024-01-01'
    },
    {
      id: '8',
      name: 'Suresh Iyer',
      branch: 'Mass Communication',
      year: 'Third',
      division: 'A',
      rollNo: 'MC2021001',
      zprnNo: 'ZPR2021003',
      position: 'Team Lead',
      team: 'Public Outreach Team',
      phone: '+91 98765 43217',
      email: 'suresh.iyer@orbitx.com',
      photo: '/api/placeholder/200/200',
      dateOfBirth: '2002-04-12',
      socialLinks: {
        linkedin: '#',
        github: '#'
      },
      createdAt: '2024-01-01'
    },
    {
      id: '9',
      name: 'Amit Sharma',
      branch: 'English Literature',
      year: 'Final',
      division: 'A',
      rollNo: 'EL2020001',
      zprnNo: 'ZPR2020003',
      position: 'Team Lead',
      team: 'Documentation Team',
      phone: '+91 98765 43218',
      email: 'amit.sharma@orbitx.com',
      photo: '/api/placeholder/200/200',
      dateOfBirth: '2001-09-08',
      socialLinks: {
        linkedin: '#',
        github: '#'
      },
      createdAt: '2024-01-01'
    },
    {
      id: '10',
      name: 'Neha Kapoor',
      branch: 'Journalism',
      year: 'Second',
      division: 'A',
      rollNo: 'JN2022001',
      zprnNo: 'ZPR2022003',
      position: 'Core Member',
      team: 'Documentation Team',
      phone: '+91 98765 43219',
      email: 'neha.kapoor@orbitx.com',
      photo: '/api/placeholder/200/200',
      dateOfBirth: '2003-06-14',
      socialLinks: {
        linkedin: '#',
        github: '#',
        instagram: '#'
      },
      createdAt: '2024-01-01'
    },
    {
      id: '11',
      name: 'Shreya Pandey',
      branch: 'Graphic Design',
      year: 'Third',
      division: 'B',
      rollNo: 'GD2021001',
      zprnNo: 'ZPR2021004',
      position: 'Team Lead',
      team: 'Social Media & Editing Team',
      phone: '+91 98765 43220',
      email: 'shreya.pandey@orbitx.com',
      photo: '/api/placeholder/200/200',
      dateOfBirth: '2002-10-30',
      socialLinks: {
        linkedin: '#'
      },
      createdAt: '2024-01-01'
    },
    {
      id: '12',
      name: 'Aryan Malhotra',
      branch: 'Digital Media',
      year: 'Second',
      division: 'A',
      rollNo: 'DM2022001',
      zprnNo: 'ZPR2022004',
      position: 'Core Member',
      team: 'Social Media & Editing Team',
      phone: '+91 98765 43221',
      email: 'aryan.malhotra@orbitx.com',
      photo: '/api/placeholder/200/200',
      dateOfBirth: '2003-02-17',
      socialLinks: {
        linkedin: '#',
        github: '#'
      },
      createdAt: '2024-01-01'
    }
  ]

  const displayMembers = filteredMembers.length > 0 ? filteredMembers : sampleMembers
  const teams = ['Design & Innovation Team', 'Technical Team', 'Management & Operations Team', 'Public Outreach Team', 'Documentation Team', 'Social Media & Editing Team']

  const getRoleColor = (position: string) => {
    if (!position) return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    switch (position.toLowerCase()) {
      case 'faculty coordinator':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      case 'team lead':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      case 'core member':
        return 'bg-green-500/20 text-green-300 border-green-500/30'
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
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

  return (
    <div className="pt-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Our Team
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Meet the passionate individuals who make OrbitX's mission possible. 
            From faculty coordinators to dedicated students, we're all united by our love for space exploration.
          </p>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                value={filterTeam}
                onChange={(e) => setFilterTeam(e.target.value)}
                className="pl-10 pr-8 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 transition-colors appearance-none min-w-[200px]"
              >
                <option value="all">All Teams</option>
                {teams.map(team => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Members Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-md border border-white/10 shadow-2xl hover:shadow-blue-500/20 transition-all duration-500"
            >
              {/* Background Image */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
              
              {/* Profile Photo */}
              <div className="relative h-80 overflow-hidden">
                <Image
                  src={member.photo}
                  alt={member.name}
                  width={300}
                  height={320}
                  className="w-full h-full object-contain bg-gray-900/50"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    target.nextElementSibling?.classList.remove('hidden')
                  }}
                />
                <div className="hidden w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  <div className="text-8xl opacity-30">👤</div>
                </div>
                
                {/* Role Badge */}
                <div className="absolute top-4 right-4 z-20">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${getRoleColor(member.position)}`}>
                    {member.position}
                  </span>
                </div>
                
                {/* Hover Overlay */}
                <div 
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex items-center justify-center cursor-pointer"
                  onClick={() => setSelectedMember(member)}
                >
                  <div className="text-center">
                    <div className="text-white text-sm mb-2">View Profile</div>
                    <div className="w-12 h-0.5 bg-blue-400 mx-auto"></div>
                  </div>
                </div>
              </div>

              {/* Member Info */}
              <div className="relative z-20 p-4 sm:p-6 bg-gradient-to-t from-black/90 to-transparent">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors line-clamp-2">
                  {member.name}
                </h3>
                <p className="text-blue-400 text-xs sm:text-sm font-medium mb-1 line-clamp-1">{member.team}</p>
                <p className="text-purple-400 text-xs font-medium mb-1 line-clamp-1">{member.position}</p>
                <p className="text-gray-400 text-xs mb-3 sm:mb-4 line-clamp-1">{member.branch} • {member.year}-{member.division}</p>
                


                {/* Skills */}
                {member.skills && member.skills.length > 0 && (
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {member.skills.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30">
                          {skill}
                        </span>
                      ))}
                      {member.skills.length > 3 && (
                        <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
                          +{member.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Social Links */}
                <div className="flex justify-between items-center gap-2">
                  <div className="flex space-x-1 sm:space-x-2 flex-shrink-0">
                    {member.socialLinks?.linkedin && (
                      <a
                        href={member.socialLinks.linkedin.startsWith('http') ? member.socialLinks.linkedin : `https://${member.socialLinks.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600/20 border border-blue-500/30 rounded-lg flex items-center justify-center hover:bg-blue-600/40 hover:scale-110 transition-all duration-200 group/social"
                        aria-label="LinkedIn"
                      >
                        <Linkedin className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400 group-hover/social:text-blue-300" />
                      </a>
                    )}
                    {member.socialLinks?.github && (
                      <a
                        href={member.socialLinks.github.startsWith('http') ? member.socialLinks.github : `https://${member.socialLinks.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-600/20 border border-gray-500/30 rounded-lg flex items-center justify-center hover:bg-gray-600/40 hover:scale-110 transition-all duration-200 group/social"
                        aria-label="GitHub"
                      >
                        <Github className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 group-hover/social:text-gray-300" />
                      </a>
                    )}
                    {member.socialLinks?.instagram && (
                      <a
                        href={member.socialLinks.instagram.startsWith('http') ? member.socialLinks.instagram : `https://${member.socialLinks.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-7 h-7 sm:w-8 sm:h-8 bg-pink-600/20 border border-pink-500/30 rounded-lg flex items-center justify-center hover:bg-pink-600/40 hover:scale-110 transition-all duration-200 group/social"
                        aria-label="Instagram"
                      >
                        <Instagram className="h-3 w-3 sm:h-4 sm:w-4 text-pink-400 group-hover/social:text-pink-300" />
                      </a>
                    )}
                  </div>
                  
                  {/* View More Button */}
                  <button 
                    onClick={() => setSelectedMember(member)}
                    className="px-2 py-1 sm:px-3 sm:py-1 bg-blue-600/20 border border-blue-500/30 rounded-lg text-blue-400 text-xs font-medium hover:bg-blue-600/40 transition-all duration-200 flex-shrink-0"
                  >
                    View
                  </button>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500" />
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-all duration-500" />
              <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-purple-500/10 rounded-full blur-xl group-hover:bg-purple-500/20 transition-all duration-500" />
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredMembers.length === 0 && searchTerm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-400 text-lg">
              No members found matching "{searchTerm}"
            </p>
          </motion.div>
        )}

        {/* Member Detail Modal */}
        {selectedMember && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedMember(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl border border-white/20 rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex justify-between items-start mb-8"
              >
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Member Profile</h2>
                  <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedMember(null)}
                  className="p-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
                >
                  <X className="h-6 w-6" />
                </motion.button>
              </motion.div>

              <div className="flex flex-col lg:flex-row gap-8">
                {/* Photo Section */}
                <motion.div 
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex-shrink-0 text-center lg:text-left"
                >
                  <div className="relative inline-block">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3, type: "spring", damping: 20 }}
                      className="w-40 h-52 lg:w-44 lg:h-56 rounded-3xl border-4 border-white/20 shadow-2xl overflow-hidden"
                    >
                      <Image
                        src={selectedMember.photo}
                        alt={selectedMember.name}
                        width={176}
                        height={224}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          target.nextElementSibling?.classList.remove('hidden')
                        }}
                      />
                    </motion.div>
                    <div className="hidden w-40 h-52 lg:w-44 lg:h-56 rounded-3xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border-4 border-white/20 shadow-2xl">
                      <span className="text-6xl lg:text-7xl opacity-30">👤</span>
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full animate-pulse"></div>
                    <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-purple-500 rounded-full animate-pulse delay-1000"></div>
                  </div>
                </motion.div>

                {/* Details Section */}
                <motion.div 
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex-1 space-y-6"
                >
                  {/* Name and Role */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h3 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      {selectedMember.name}
                    </h3>
                    <div className="flex flex-wrap gap-3 mb-4">
                      <motion.span 
                        whileHover={{ scale: 1.05 }}
                        className={`px-4 py-2 rounded-full text-sm font-semibold ${getRoleColor(selectedMember.position)} border`}
                      >
                        {selectedMember.position}
                      </motion.span>
                      <motion.span 
                        whileHover={{ scale: 1.05 }}
                        className="px-4 py-2 rounded-full text-sm bg-blue-500/20 text-blue-300 border border-blue-500/30"
                      >
                        {selectedMember.team}
                      </motion.span>
                    </div>
                  </motion.div>

                  {/* Personal Info */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white/5 rounded-2xl p-6 border border-white/10"
                  >
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                      Personal Information
                    </h4>
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
                      <div className="flex space-x-4">
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
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="glass-card p-12 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
            <h2 className="text-3xl font-bold text-white mb-4">Want to Join Our Team?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              We're always looking for passionate individuals to join our space exploration journey. 
              Whether you're interested in engineering, research, or outreach, there's a place for you at OrbitX.
            </p>
            <a href="/contact" className="btn-primary">
              Get In Touch
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}