'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { Target, Eye, Users, Lightbulb, Rocket, Globe, Star, Zap, Award, TrendingUp } from 'lucide-react'
import { useRef, useEffect, useState } from 'react'
import { useAboutData } from '@/hooks/useAboutData'
import { useTeamData } from '@/hooks/useTeamData'

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const y = useTransform(scrollYProgress, [0, 1], [0, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.6])
  
  const { stats: realStats, loading } = useAboutData()
  const { leadership, teamLeaders, members, loading: teamLoading } = useTeamData()
  const [animatedStats, setAnimatedStats] = useState({
    members: 0,
    projects: 0,
    events: 0,
    achievements: 0
  })

  useEffect(() => {
    if (!loading && realStats) {
      const animateToTarget = () => {
        const duration = 800
        const steps = 30
        const stepDuration = duration / steps
        
        let currentStep = 0
        const interval = setInterval(() => {
          currentStep++
          const progress = Math.min(currentStep / steps, 1)
          const easeOut = 1 - Math.pow(1 - progress, 3)
          
          setAnimatedStats({
            members: Math.floor(realStats.members * easeOut),
            projects: Math.floor(realStats.projects * easeOut),
            events: Math.floor(realStats.events * easeOut),
            achievements: Math.floor(realStats.achievements * easeOut)
          })
          
          if (currentStep >= steps) {
            clearInterval(interval)
            setAnimatedStats(realStats)
          }
        }, stepDuration)
      }
      
      const timer = setTimeout(animateToTarget, 300)
      return () => clearTimeout(timer)
    }
  }, [realStats, loading])

  const values = [
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'Pushing boundaries with creative solutions and cutting-edge technology',
      color: 'from-yellow-400 to-orange-400'
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'Working together to achieve extraordinary results in space exploration',
      color: 'from-blue-400 to-indigo-400'
    },
    {
      icon: Globe,
      title: 'Learning',
      description: 'Continuous growth through hands-on experience and knowledge sharing',
      color: 'from-green-400 to-teal-400'
    },
    {
      icon: Rocket,
      title: 'Excellence',
      description: 'Striving for the highest standards in everything we do',
      color: 'from-purple-400 to-pink-400'
    }
  ]

  const achievements = [
    { icon: Award, title: 'National Recognition', count: '5+' },
    { icon: TrendingUp, title: 'Success Rate', count: '95%' },
    { icon: Star, title: 'Industry Partners', count: '10+' },
    { icon: Zap, title: 'Innovation Awards', count: '3+' }
  ]

  return (
    <div ref={containerRef} className="pt-16 sm:pt-20 px-4 sm:px-6 lg:px-8 overflow-x-hidden relative">
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              delay: i * 0.5
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>
      <motion.div className="max-w-6xl mx-auto" style={{ y, opacity }}>
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16 lg:mb-20 relative"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8 w-16 h-16 border-2 border-blue-400/30 rounded-full"
          >
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-400 rounded-full" />
          </motion.div>
          
          <motion.h1 
            className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 lg:mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
            animate={{ backgroundPosition: ['0%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
          >
            About OrbitX
          </motion.h1>
          
          <motion.p 
            className="text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            OrbitX is a dynamic student organization dedicated to exploring the frontiers of space technology, 
            fostering innovation, and building a community of passionate learners and creators.
          </motion.p>

          {/* Dynamic Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto"
          >
            <div className="text-center p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl border border-white/10 backdrop-blur-sm">
              <motion.div 
                className="text-2xl sm:text-3xl font-bold text-blue-400 mb-1"
                key={animatedStats.members}
                initial={{ scale: 1.1, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {loading ? '...' : `${animatedStats.members}+`}
              </motion.div>
              <div className="text-xs sm:text-sm text-gray-400">Active Members</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-white/10 backdrop-blur-sm">
              <motion.div 
                className="text-2xl sm:text-3xl font-bold text-purple-400 mb-1"
                key={animatedStats.projects}
                initial={{ scale: 1.1, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {loading ? '...' : `${animatedStats.projects}+`}
              </motion.div>
              <div className="text-xs sm:text-sm text-gray-400">Projects</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-500/10 to-teal-500/10 rounded-xl border border-white/10 backdrop-blur-sm">
              <motion.div 
                className="text-2xl sm:text-3xl font-bold text-green-400 mb-1"
                key={animatedStats.events}
                initial={{ scale: 1.1, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {loading ? '...' : `${animatedStats.events}+`}
              </motion.div>
              <div className="text-xs sm:text-sm text-gray-400">Events</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl border border-white/10 backdrop-blur-sm">
              <motion.div 
                className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-1"
                key={animatedStats.achievements}
                initial={{ scale: 1.1, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {loading ? '...' : `${animatedStats.achievements}+`}
              </motion.div>
              <div className="text-xs sm:text-sm text-gray-400">Achievements</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 xl:gap-12 mb-12 sm:mb-16 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.01, rotateY: 3 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="p-6 sm:p-8 lg:p-10 xl:p-12 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-md border border-blue-500/20 rounded-2xl hover:border-blue-400/40 transition-all duration-300 relative overflow-hidden"
          >
            <motion.div 
              className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full -translate-y-16 translate-x-16"
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
            <div className="flex items-center mb-4 sm:mb-6 lg:mb-8 relative z-10">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Target className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 xl:h-12 xl:w-12 text-blue-400 mr-3 sm:mr-4 flex-shrink-0" />
              </motion.div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Our Mission</h2>
            </div>
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-300 leading-relaxed relative z-10">
              To inspire and empower students to explore space technology through hands-on projects, 
              collaborative learning, and innovative research. We aim to bridge the gap between 
              theoretical knowledge and practical application in the field of aerospace engineering 
              and space sciences.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.01, rotateY: -3 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="p-6 sm:p-8 lg:p-10 xl:p-12 bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-md border border-purple-500/20 rounded-2xl hover:border-purple-400/40 transition-all duration-300 relative overflow-hidden"
          >
            <motion.div 
              className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-transparent rounded-full -translate-y-16 -translate-x-16"
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
            <div className="flex items-center mb-4 sm:mb-6 lg:mb-8 relative z-10">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Eye className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 xl:h-12 xl:w-12 text-purple-400 mr-3 sm:mr-4 flex-shrink-0" />
              </motion.div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Our Vision</h2>
            </div>
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-300 leading-relaxed relative z-10">
              To become a leading student organization that contributes to the advancement of space 
              technology and exploration. We envision a future where our members become pioneers 
              in the space industry, driving innovation and pushing the boundaries of what's possible 
              beyond Earth's horizons.
            </p>
          </motion.div>
        </div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 sm:mb-16 lg:mb-20"
        >
          <motion.h2 
            className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-center mb-8 sm:mb-12 lg:mb-16 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
            animate={{ backgroundPosition: ['0%', '100%'] }}
            transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
          >
            Our Core Values
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30, rotateX: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                whileHover={{ 
                  scale: 1.03, 
                  rotateY: 5,
                  boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                }}
                transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
                className={`p-6 sm:p-8 bg-gradient-to-br ${value.color.replace('from-', 'from-').replace('to-', 'to-')}/10 backdrop-blur-md border border-white/10 rounded-2xl text-center hover:border-white/20 transition-all duration-300 relative overflow-hidden group`}
              >
                <motion.div 
                  className={`absolute inset-0 bg-gradient-to-br ${value.color}/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.6 }}
                  className="relative z-10"
                >
                  <value.icon className={`h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 bg-gradient-to-r ${value.color} bg-clip-text text-transparent mx-auto mb-3 sm:mb-4`} />
                </motion.div>
                <h3 className={`text-base sm:text-lg lg:text-xl font-bold mb-2 sm:mb-3 bg-gradient-to-r ${value.color} bg-clip-text text-transparent relative z-10`}>{value.title}</h3>
                <p className="text-xs sm:text-sm lg:text-base text-gray-300 leading-relaxed relative z-10">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Achievements Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 sm:mb-16 lg:mb-20"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            Our Achievements
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1, rotateZ: 5 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-4 sm:p-6 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-md border border-yellow-500/20 rounded-xl text-center hover:border-yellow-400/40 transition-all duration-300"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                >
                  <achievement.icon className="h-8 w-8 sm:h-10 sm:w-10 text-yellow-400 mx-auto mb-2 sm:mb-3" />
                </motion.div>
                <div className="text-xl sm:text-2xl font-bold text-yellow-400 mb-1">{achievement.count}</div>
                <div className="text-xs sm:text-sm text-gray-300">{achievement.title}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>



        {/* Background Story */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.005 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="p-6 sm:p-8 lg:p-10 xl:p-12 bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-red-500/10 backdrop-blur-md border border-yellow-500/20 rounded-2xl mb-12 sm:mb-16 lg:mb-20 relative overflow-hidden group"
        >
          {/* Animated Background Elements */}
          <motion.div 
            className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-yellow-400/10 to-orange-400/10 rounded-full -translate-y-20 translate-x-20"
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-orange-400/10 to-red-400/10 rounded-full translate-y-16 -translate-x-16"
            animate={{ rotate: -360, scale: [1, 1.1, 1] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
          
          <div className="flex items-center mb-4 sm:mb-6 lg:mb-8 relative z-10">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Rocket className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 xl:h-12 xl:w-12 text-yellow-400 mr-3 sm:mr-4 flex-shrink-0" />
            </motion.div>
            <motion.h2 
              className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent"
              animate={{ backgroundPosition: ['0%', '100%'] }}
              transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
            >
              Our Journey
            </motion.h2>
          </div>
          <div className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-300 leading-relaxed space-y-4 sm:space-y-6 lg:space-y-8 relative z-10">
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Founded at ZCOER (Zeal College of Engineering and Research), OrbitX began as a small group 
              of passionate students fascinated by space exploration and technology. What started as informal 
              discussions about rockets and satellites has evolved into a comprehensive organization with 
              multiple specialized teams.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Today, OrbitX encompasses six dedicated teams working on various aspects of space technology, 
              from satellite development to space exploration research. Our members collaborate on real-world 
              projects, participate in national competitions, and contribute to the growing space technology 
              ecosystem in India.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              We believe that the future of space exploration lies in the hands of today's students. 
              Through OrbitX, we provide a platform for learning, experimentation, and innovation that 
              prepares our members for careers in the rapidly expanding space industry.
            </motion.p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}