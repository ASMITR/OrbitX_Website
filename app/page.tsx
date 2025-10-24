'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Rocket, Users, Calendar, FolderOpen, Mail, MapPin, Globe, Send, BookOpen, Palette, Code, Settings, Megaphone, FileText, Camera } from 'lucide-react'
import HeroSection from '@/components/HeroSection'
import PreviewCard from '@/components/PreviewCard'
import EnhancedLatestContent from '@/components/EnhancedLatestContent'
import { getEvents, getProjects, getMembers, getBlogs, addContactMessage } from '@/lib/db'
import { Event, Project, Member, Blog } from '@/lib/types'

interface JoinForm {
  name: string
  email: string
  phone: string
  team: string
  message: string
}

export default function Home() {
  const [events, setEvents] = useState<Event[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm<JoinForm>()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsData, projectsData, membersData, blogsData] = await Promise.all([
          getEvents(3),
          getProjects(3),
          getMembers(),
          getBlogs(3)
        ])
        setEvents(eventsData)
        setProjects(projectsData)
        setMembers(membersData)
        setBlogs(blogsData)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  const onSubmit = async (data: JoinForm) => {
    setIsSubmitting(true)
    try {
      await addContactMessage({
        name: data.name,
        email: data.email,
        message: `Join Request - Team: ${data.team}, Phone: ${data.phone}, Message: ${data.message}`,
        createdAt: new Date().toISOString()
      })
      toast.success('Application submitted successfully!')
      reset()
    } catch (error) {
      toast.error('Failed to submit application')
    } finally {
      setIsSubmitting(false)
    }
  }

  const previews = [
    {
      title: 'Events',
      description: 'Join our exciting space exploration events and workshops',
      icon: Calendar,
      href: '/events',
      color: 'from-blue-500 to-purple-500'
    },
    {
      title: 'Projects',
      description: 'Explore our innovative space technology projects',
      icon: FolderOpen,
      href: '/projects',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Blogs',
      description: 'Read our latest insights and space exploration stories',
      icon: BookOpen,
      href: '/blogs',
      color: 'from-green-500 to-blue-500'
    },
    {
      title: 'Teams',
      description: 'Meet our dedicated teams working on various domains',
      icon: Users,
      href: '/teams',
      color: 'from-pink-500 to-red-500'
    }
  ]

  const domains = [
    { name: 'Design & Innovation Team', icon: Palette },
    { name: 'Technical Team', icon: Code },
    { name: 'Management & Operations Team', icon: Settings },
    { name: 'Public Outreach Team', icon: Megaphone },
    { name: 'Documentation Team', icon: FileText },
    { name: 'Social Media & Editing Team', icon: Camera }
  ]

  return (
    <div className="relative">
      <HeroSection />
      
      {/* Preview Section */}
      <section className="py-16 sm:py-20 lg:py-24 container-fluid">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="heading-responsive font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Explore OrbitX
            </h2>
            <p className="text-responsive text-gray-300 max-w-3xl mx-auto px-4 sm:px-0">
              Discover our events, projects, and teams as we push the boundaries of space exploration
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
            {previews.map((preview, index) => (
              <motion.div
                key={preview.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="gpu-accelerated"
              >
                <PreviewCard {...preview} index={index} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Domains Section */}
      <section className="py-20 px-4 bg-gray-800/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Our Domains
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Specialized teams working on cutting-edge space technology
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {domains.map((domain, index) => {
              const IconComponent = domain.icon
              return (
                <motion.div
                  key={domain.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="glass-card p-6 text-center hover:bg-white/10 transition-all duration-300"
                >
                  <IconComponent className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-white">{domain.name}</h3>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team Members Preview */}
      <section className="py-16 sm:py-20 lg:py-24 container-fluid">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Passionate individuals driving space exploration forward
            </p>
          </motion.div>

          <motion.div 
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text mb-4"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {members.length}+
            </motion.div>
            <p className="text-lg sm:text-xl text-gray-300 mb-8">Active Team Members</p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/members" className="btn-primary px-8 py-4 text-lg">
                Meet the Team
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Latest Content */}
      <EnhancedLatestContent events={events} projects={projects} blogs={blogs} />

      {/* Join Us Form */}
      <section className="py-16 sm:py-20 lg:py-24 container-fluid">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Join OrbitX
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Ready to explore beyond horizons? Apply to join our team and be part of the space revolution.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass-card p-8"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                <input
                  {...register('name', { required: 'Name is required' })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                  placeholder="Enter your email"
                />
                {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone *</label>
                <input
                  {...register('phone', { required: 'Phone is required' })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                  placeholder="Enter your phone number"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-400">{errors.phone.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Team *</label>
                <select
                  {...register('team', { required: 'Team selection is required' })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 transition-colors"
                >
                  <option value="">Select a team</option>
                  {domains.map(domain => (
                    <option key={domain.name} value={domain.name}>{domain.name}</option>
                  ))}
                </select>
                {errors.team && <p className="mt-1 text-sm text-red-400">{errors.team.message}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Why do you want to join OrbitX?</label>
                <textarea
                  rows={4}
                  {...register('message')}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors resize-none"
                  placeholder="Tell us about your interest in space technology and what you hope to contribute..."
                />
              </div>

              <div className="md:col-span-2 flex justify-center">
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center px-12 py-4 text-lg font-semibold min-w-[200px]"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Submit Application
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20 px-4 bg-gray-800/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Get In Touch
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="glass-card p-6"
            >
              <Mail className="h-8 w-8 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Email</h3>
              <p className="text-gray-300">orbitx@zcoer.edu.in</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="glass-card p-6"
            >
              <MapPin className="h-8 w-8 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Location</h3>
              <p className="text-gray-300">ZCOER, Pune, Maharashtra</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass-card p-6"
            >
              <Rocket className="h-8 w-8 text-pink-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Mission</h3>
              <p className="text-gray-300">Exploring Beyond Horizons</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}