'use client'

import { useState, useEffect, useMemo, lazy, Suspense } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Rocket, Users, Calendar, FolderOpen, Mail, MapPin, Send, BookOpen, Palette, Code, Settings, Megaphone, FileText, Camera, Star, Zap, Globe, Sparkles } from 'lucide-react'
import HeroSection from '@/components/HeroSection'
import PreviewCard from '@/components/PreviewCard'
import { getEvents, getProjects, getMembers, getBlogs, addContactMessage } from '@/lib/db'
import { Event, Project, Member, Blog } from '@/lib/types'
import { debounce } from '@/lib/performance'

// Lazy load heavy components
const EnhancedLatestContent = lazy(() => import('@/components/EnhancedLatestContent'))

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
  const [isLoading, setIsLoading] = useState(true)
  const { register, handleSubmit, reset, formState: { errors } } = useForm<JoinForm>()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        // Stagger data loading for better performance
        const [eventsData, projectsData] = await Promise.all([
          getEvents(3),
          getProjects(3)
        ])
        setEvents(eventsData)
        setProjects(projectsData)
        
        // Load less critical data after
        const [membersData, blogsData] = await Promise.all([
          getMembers(),
          getBlogs(3)
        ])
        setMembers(membersData)
        setBlogs(blogsData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
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

  const previews = useMemo(() => [
    {
      title: 'Events',
      description: 'Join space exploration events',
      icon: Calendar,
      href: '/events',
      color: 'from-cyan-500 via-blue-500 to-purple-600'
    },
    {
      title: 'Projects',
      description: 'Explore space technology projects',
      icon: FolderOpen,
      href: '/projects',
      color: 'from-purple-500 via-pink-500 to-rose-600'
    },
    {
      title: 'Blogs',
      description: 'Read space exploration insights',
      icon: BookOpen,
      href: '/blogs',
      color: 'from-emerald-500 via-teal-500 to-cyan-600'
    },
    {
      title: 'Teams',
      description: 'Meet our space technology teams',
      icon: Users,
      href: '/teams',
      color: 'from-orange-500 via-red-500 to-pink-600'
    }
  ], [])

  const domains = [
    { name: 'Design & Innovation Team', icon: Palette },
    { name: 'Technical Team', icon: Code },
    { name: 'Management & Operations Team', icon: Settings },
    { name: 'Public Outreach Team', icon: Megaphone },
    { name: 'Documentation Team', icon: FileText },
    { name: 'Social Media & Editing Team', icon: Camera }
  ]

  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3])

  return (
    <div className="relative overflow-hidden">
      {/* Enhanced Floating Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${
              i % 3 === 0 ? 'w-3 h-3 bg-cyan-400/30' :
              i % 3 === 1 ? 'w-2 h-2 bg-blue-400/25' :
              'w-1 h-1 bg-purple-400/40'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -150, 0],
              x: [0, Math.sin(i) * 50, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1.5, 0.5],
              rotate: [0, 360]
            }}
            transition={{
              duration: 10 + Math.random() * 8,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
          />
        ))}
        
        {/* Constellation lines */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={`line-${i}`}
            className="absolute h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent"
            style={{
              left: `${Math.random() * 80}%`,
              top: `${Math.random() * 80}%`,
              width: `${50 + Math.random() * 100}px`,
              transform: `rotate(${Math.random() * 360}deg)`
            }}
            animate={{
              opacity: [0, 0.6, 0],
              scaleX: [0, 1, 0]
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3
            }}
          />
        ))}
      </div>
      
      <HeroSection />
      
      {/* Enhanced Preview Section */}
      <section className="py-20 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 relative">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/15 via-purple-500/10 to-cyan-500/15 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, 180, 360],
              x: [0, 50, 0],
              y: [0, -30, 0]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-500/15 via-teal-500/10 to-blue-500/15 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 0.8, 1.2],
              rotate: [360, 180, 0],
              x: [0, -40, 0],
              y: [0, 40, 0]
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-pink-500/10 via-purple-500/15 to-indigo-500/10 rounded-full blur-3xl"
            animate={{
              scale: [0.8, 1.4, 0.8],
              rotate: [0, -360, 0],
              x: [-100, 100, -100],
              y: [50, -50, 50]
            }}
            transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16 lg:mb-20"
          >
            <motion.div
              className="flex items-center justify-center gap-4 mb-6"
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
                  scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                }}
                className="relative"
              >
                <Star className="w-8 h-8 text-yellow-400 drop-shadow-lg" />
                <motion.div
                  className="absolute inset-0 w-8 h-8 bg-yellow-400/30 rounded-full blur-md"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
              <motion.h2 
                className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{ duration: 5, repeat: Infinity }}
                style={{
                  backgroundSize: '200% 100%'
                }}
              >
                Explore OrbitX
              </motion.h2>
              <motion.div
                animate={{ 
                  rotate: -360,
                  scale: [1, 1.3, 1]
                }}
                transition={{ 
                  rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
                  scale: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
                }}
                className="relative"
              >
                <Sparkles className="w-8 h-8 text-cyan-400 drop-shadow-lg" />
                <motion.div
                  className="absolute inset-0 w-8 h-8 bg-cyan-400/30 rounded-full blur-md"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                />
              </motion.div>
            </motion.div>
            
            <motion.p 
              className="text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-300 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Discover our events, projects, and teams as we push the boundaries of space exploration
            </motion.p>
            
            {/* Animated underline */}
            <motion.div
              className="w-24 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 mx-auto mt-6 rounded-full"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            />
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
            {previews.map((preview, index) => (
              <motion.div 
                key={preview.title} 
                className="group relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
              >

                
                <PreviewCard {...preview} index={index} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Domains Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Enhanced Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <motion.div 
            className="absolute inset-0"
            animate={{
              background: [
                'radial-gradient(circle at 25% 25%, #06b6d4 0%, transparent 50%), radial-gradient(circle at 75% 75%, #3b82f6 0%, transparent 50%)',
                'radial-gradient(circle at 75% 25%, #8b5cf6 0%, transparent 50%), radial-gradient(circle at 25% 75%, #06b6d4 0%, transparent 50%)',
                'radial-gradient(circle at 50% 50%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 80% 20%, #8b5cf6 0%, transparent 50%)'
              ]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Floating geometric shapes */}
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-4 h-4 border border-cyan-400/20 ${
                i % 2 === 0 ? 'rotate-45' : 'rounded-full'
              }`}
              style={{
                left: `${20 + (i * 15)}%`,
                top: `${10 + (i * 12)}%`
              }}
              animate={{
                y: [0, -30, 0],
                rotate: [0, 180, 360],
                opacity: [0.2, 0.6, 0.2]
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                delay: i * 0.5
              }}
            />
          ))}
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16 lg:mb-20"
          >
            <motion.div className="flex items-center justify-center gap-3 mb-6">
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Globe className="w-8 h-8 text-orange-400" />
              </motion.div>
              <h2 className="text-responsive-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                Our Domains
              </h2>
              <motion.div
                animate={{ 
                  rotate: [360, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Zap className="w-8 h-8 text-red-400" />
              </motion.div>
            </motion.div>
            
            <motion.p 
              className="text-responsive-lg text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Specialized teams working on cutting-edge space technology
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {domains.map((domain, index) => {
              const IconComponent = domain.icon
              return (
                <motion.div
                  key={domain.name}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.1,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  viewport={{ once: true, margin: "-30px" }}
                  whileHover={{ 
                    y: -8,
                    scale: 1.05,
                    transition: { duration: 0.3 }
                  }}
                  className="group relative"
                >
                  <div className="text-center transition-all duration-300 min-h-[80px] sm:min-h-[90px] lg:min-h-[100px] flex flex-col justify-center p-3 sm:p-4 lg:p-5 relative overflow-hidden border border-white/20 rounded-xl backdrop-blur-sm bg-white/5 hover:bg-white/10 hover:border-white/30 hover:shadow-lg hover:shadow-cyan-500/20">

                    
                    {/* Icon */}
                    <div className="relative z-10">
                      <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-blue-400 mx-auto mb-2 sm:mb-3 group-hover:text-cyan-300 transition-colors duration-300" />
                    </div>
                    
                    <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-white leading-tight px-1 relative z-10 group-hover:text-cyan-100 transition-colors duration-300">
                      {domain.name}
                    </h3>
                    

                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>



      {/* Enhanced Latest Content */}
      {!isLoading && (
        <Suspense fallback={
          <div className="py-20 flex justify-center">
            <motion.div 
              className="relative"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-12 h-12 border-4 border-cyan-400/20 border-t-cyan-400 rounded-full"></div>
              <motion.div
                className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-purple-400 rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </div>
        }>
          <EnhancedLatestContent events={events} projects={projects} blogs={blogs} />
        </Suspense>
      )}

      {/* Enhanced Join Us Form */}
      <section className="py-20 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ duration: 20, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 0.8, 1.2],
              rotate: [360, 180, 0]
            }}
            transition={{ duration: 25, repeat: Infinity }}
          />
        </div>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16 relative z-10"
          >
            <motion.div className="flex items-center justify-center gap-4 mb-6">
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
                  scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                }}
              >
                <Rocket className="w-8 h-8 text-orange-400" />
              </motion.div>
              <motion.h2 
                className="heading-lg font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{ duration: 5, repeat: Infinity }}
                style={{ backgroundSize: '200% 100%' }}
              >
                Join OrbitX
              </motion.h2>
              <motion.div
                animate={{ 
                  rotate: -360,
                  scale: [1, 1.3, 1]
                }}
                transition={{ 
                  rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
                  scale: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
                }}
              >
                <Star className="w-8 h-8 text-red-400" />
              </motion.div>
            </motion.div>
            <motion.p 
              className="text-lg-responsive text-gray-300 max-w-2xl mx-auto px-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Ready to explore beyond horizons? Apply to join our team and be part of the space revolution that will shape the future of humanity.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass-card p-6 sm:p-8 lg:p-10 shadow-2xl"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                <input
                  {...register('name', { required: 'Name is required' })}
                  className="w-full px-3 sm:px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors touch-target"
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  className="w-full px-3 sm:px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors touch-target"
                  placeholder="Enter your email"
                />
                {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone *</label>
                <input
                  {...register('phone', { required: 'Phone is required' })}
                  className="w-full px-3 sm:px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors touch-target"
                  placeholder="Enter your phone number"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-400">{errors.phone.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Team *</label>
                <select
                  {...register('team', { required: 'Team selection is required' })}
                  className="w-full px-3 sm:px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 transition-colors touch-target appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em'
                  }}
                >
                  <option value="" className="bg-black text-white">Select a team</option>
                  {domains.map(domain => (
                    <option key={domain.name} value={domain.name} className="bg-black text-white">{domain.name}</option>
                  ))}
                </select>
                {errors.team && <p className="mt-1 text-sm text-red-400">{errors.team.message}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Why do you want to join OrbitX?</label>
                <textarea
                  rows={4}
                  {...register('message')}
                  className="w-full px-3 sm:px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors resize-none"
                  placeholder="Tell us about your interest in space technology and what you hope to contribute..."
                />
              </div>

              <div className="md:col-span-2 flex justify-center px-4">
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg font-semibold min-w-[180px] sm:min-w-[200px] touch-target"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                      <span className="text-sm sm:text-base">Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      <span className="text-sm sm:text-base">Submit Application</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Contact Info */}
      <section className="section-padding container-fluid relative overflow-hidden">
        {/* Enhanced Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <motion.div 
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2306b6d4' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          {/* Orbiting elements */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-32 h-32 border border-cyan-400/10 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            <motion.div
              className="absolute top-0 left-1/2 w-2 h-2 bg-cyan-400/40 rounded-full transform -translate-x-1/2"
              animate={{ rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <motion.div className="flex items-center justify-center gap-4 mb-6">
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Mail className="w-8 h-8 text-orange-400" />
              </motion.div>
              <h2 className="heading-lg font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                Get In Touch
              </h2>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 text-center">
            {[
              { icon: Mail, title: 'Email', content: 'orbitx@zcoer.edu.in', color: 'text-blue-400', delay: 0 },
              { icon: MapPin, title: 'Location', content: 'ZCOER, Pune, Maharashtra', color: 'text-purple-400', delay: 0.1 },
              { icon: Rocket, title: 'Mission', content: 'Exploring Beyond Horizons', color: 'text-pink-400', delay: 0.2 }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: item.delay }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -10,
                  scale: 1.05,
                  transition: { duration: 0.3 }
                }}
                className="group relative"
              >
                <div className="p-4 sm:p-6 min-h-[140px] sm:min-h-[160px] flex flex-col justify-center relative overflow-hidden">
                  {/* Animated background */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    animate={{
                      background: [
                        'linear-gradient(45deg, rgba(6,182,212,0.1), rgba(59,130,246,0.1))',
                        'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))',
                        'linear-gradient(225deg, rgba(139,92,246,0.1), rgba(6,182,212,0.1))'
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  
                  <motion.div
                    className="relative z-10"
                    whileHover={{ 
                      rotate: [0, -5, 5, 0],
                      scale: 1.1
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <item.icon className={`h-8 w-8 sm:h-10 sm:w-10 ${item.color} mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`} />
                  </motion.div>
                  
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-2 relative z-10 group-hover:text-cyan-100 transition-colors duration-300">
                    {item.title}
                  </h3>
                  
                  <p className={`text-sm sm:text-base text-gray-300 relative z-10 group-hover:text-gray-200 transition-colors duration-300 ${
                    item.title === 'Email' ? 'break-all' : ''
                  }`}>
                    {item.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}