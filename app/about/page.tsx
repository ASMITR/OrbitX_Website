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
    <div className="pt-20 container-fluid overflow-x-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 sm:mb-20"
        >
          <h1 className="heading-xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent px-2">
            About OrbitX
          </h1>
          <p className="text-lg-responsive text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
            OrbitX is a dynamic student organization dedicated to exploring the frontiers of space technology, 
            fostering innovation, and building a community of passionate learners and creators.
          </p>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-responsive-lg mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="card-responsive glass-card"
          >
            <div className="flex items-center mb-4 sm:mb-6">
              <Target className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400 mr-3 flex-shrink-0" />
              <h2 className="heading-md font-bold text-white">Our Mission</h2>
            </div>
            <p className="text-responsive text-gray-300 leading-relaxed">
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
            className="card-responsive glass-card"
          >
            <div className="flex items-center mb-4 sm:mb-6">
              <Eye className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400 mr-3 flex-shrink-0" />
              <h2 className="heading-md font-bold text-white">Our Vision</h2>
            </div>
            <p className="text-responsive text-gray-300 leading-relaxed">
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
          className="mb-16 sm:mb-20"
        >
          <h2 className="heading-lg font-bold text-center mb-8 sm:mb-12 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent px-2">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-responsive">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="card-responsive glass-card text-center hover:bg-white/20 transition-all duration-300"
              >
                <value.icon className="h-10 w-10 sm:h-12 sm:w-12 text-blue-400 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">{value.title}</h3>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Background Story */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="card-responsive glass-card mb-16 sm:mb-20"
        >
          <div className="flex items-center mb-4 sm:mb-6">
            <Rocket className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-400 mr-3 flex-shrink-0" />
            <h2 className="heading-md font-bold text-white">Our Journey</h2>
          </div>
          <div className="text-responsive text-gray-300 leading-relaxed space-y-4">
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