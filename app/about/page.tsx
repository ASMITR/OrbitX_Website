'use client'

import { motion } from 'framer-motion'
import { Target, Eye, Users, Lightbulb, Rocket, Globe } from 'lucide-react'

export default function About() {
  const values = [
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'Pushing boundaries with creative solutions and cutting-edge technology'
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'Working together to achieve extraordinary results in space exploration'
    },
    {
      icon: Globe,
      title: 'Learning',
      description: 'Continuous growth through hands-on experience and knowledge sharing'
    }
  ]

  return (
    <div className="pt-16 sm:pt-20 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 lg:mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            About OrbitX
          </h1>
          <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            OrbitX is a dynamic student organization dedicated to exploring the frontiers of space technology, 
            fostering innovation, and building a community of passionate learners and creators.
          </p>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 xl:gap-12 mb-12 sm:mb-16 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="p-6 sm:p-8 lg:p-10 xl:p-12 glass-card"
          >
            <div className="flex items-center mb-4 sm:mb-6 lg:mb-8">
              <Target className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 xl:h-12 xl:w-12 text-blue-400 mr-3 sm:mr-4 flex-shrink-0" />
              <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-white">Our Mission</h2>
            </div>
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-300 leading-relaxed">
              To inspire and empower students to explore space technology through hands-on projects, 
              collaborative learning, and innovative research. We aim to bridge the gap between 
              theoretical knowledge and practical application in the field of aerospace engineering 
              and space sciences.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="p-6 sm:p-8 lg:p-10 xl:p-12 glass-card"
          >
            <div className="flex items-center mb-4 sm:mb-6 lg:mb-8">
              <Eye className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 xl:h-12 xl:w-12 text-purple-400 mr-3 sm:mr-4 flex-shrink-0" />
              <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-white">Our Vision</h2>
            </div>
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-300 leading-relaxed">
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
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-center mb-8 sm:mb-12 lg:mb-16 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 xl:gap-10">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="p-6 sm:p-8 lg:p-10 xl:p-12 glass-card text-center hover:bg-white/20 transition-all duration-300"
              >
                <value.icon className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 xl:h-14 xl:w-14 text-blue-400 mx-auto mb-3 sm:mb-4 lg:mb-6" />
                <h3 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-white mb-2 sm:mb-3 lg:mb-4">{value.title}</h3>
                <p className="text-xs sm:text-sm lg:text-base xl:text-lg text-gray-300 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Background Story */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="p-6 sm:p-8 lg:p-10 xl:p-12 glass-card mb-12 sm:mb-16 lg:mb-20"
        >
          <div className="flex items-center mb-4 sm:mb-6 lg:mb-8">
            <Rocket className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 xl:h-12 xl:w-12 text-yellow-400 mr-3 sm:mr-4 flex-shrink-0" />
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-white">Our Journey</h2>
          </div>
          <div className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-300 leading-relaxed space-y-4 sm:space-y-6 lg:space-y-8">
            <p>
              Founded at ZCOER (Zeal College of Engineering and Research), OrbitX began as a small group 
              of passionate students fascinated by space exploration and technology. What started as informal 
              discussions about rockets and satellites has evolved into a comprehensive organization with 
              multiple specialized teams.
            </p>
            <p>
              Today, OrbitX encompasses six dedicated teams working on various aspects of space technology, 
              from satellite development to space exploration research. Our members collaborate on real-world 
              projects, participate in national competitions, and contribute to the growing space technology 
              ecosystem in India.
            </p>
            <p>
              We believe that the future of space exploration lies in the hands of today's students. 
              Through OrbitX, we provide a platform for learning, experimentation, and innovation that 
              prepares our members for careers in the rapidly expanding space industry.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}