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
    <div className="pt-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            About OrbitX
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            OrbitX is a dynamic student organization dedicated to exploring the frontiers of space technology, 
            fostering innovation, and building a community of passionate learners and creators.
          </p>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="glass-card p-8"
          >
            <div className="flex items-center mb-6">
              <Target className="h-8 w-8 text-blue-400 mr-3" />
              <h2 className="text-3xl font-bold text-white">Our Mission</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">
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
            className="glass-card p-8"
          >
            <div className="flex items-center mb-6">
              <Eye className="h-8 w-8 text-purple-400 mr-3" />
              <h2 className="text-3xl font-bold text-white">Our Vision</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">
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
          className="mb-20"
        >
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="glass-card p-6 text-center hover:bg-white/20 transition-all duration-300"
              >
                <value.icon className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-gray-300">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Background Story */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="glass-card p-8 mb-20"
        >
          <div className="flex items-center mb-6">
            <Rocket className="h-8 w-8 text-yellow-400 mr-3" />
            <h2 className="text-3xl font-bold text-white">Our Journey</h2>
          </div>
          <div className="text-gray-300 leading-relaxed space-y-4">
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