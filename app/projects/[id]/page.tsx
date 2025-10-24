'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Users, ExternalLink, Github, Play } from 'lucide-react'
import { getProject } from '@/lib/db'
import { Project } from '@/lib/types'

export default function ProjectDetail() {
  const params = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectData = await getProject(params.id as string)
        setProject(projectData)
      } catch (error) {
        console.error('Error fetching project:', error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProject()
    }
  }, [params.id])

  // Sample project data for demonstration
  const sampleProject: Project = {
    id: '1',
    title: 'CubeSat-1 Mission',
    description: `Our flagship CubeSat-1 Mission represents OrbitX's first major step into space technology. This comprehensive project involves the design, development, and deployment of a 1U CubeSat focused on Earth observation and atmospheric data collection.

The mission objectives include:
• High-resolution Earth imaging for environmental monitoring
• Atmospheric data collection for climate research
• Real-time data transmission to ground stations
• Technology demonstration for future missions

The CubeSat features advanced imaging capabilities with a custom-designed camera system capable of capturing high-resolution images of Earth's surface. The onboard computer processes and compresses images before transmitting them to our ground station network.

Our team has overcome numerous challenges in this project, from power management in the harsh space environment to ensuring reliable communication with ground stations. The project has been a tremendous learning experience for all team members involved.

The satellite is scheduled for launch in Q2 2024 aboard a commercial launch vehicle. Once deployed, it will operate in a sun-synchronous orbit at approximately 500km altitude, providing optimal conditions for Earth observation.`,
    images: ['https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517976487492-5750f3195933?w=800&h=600&fit=crop'],
    technologies: ['Arduino Nano', 'C++', 'RF Communication', 'Solar Panels', 'CMOS Camera', 'Lithium Battery'],
    contributors: ['Satellite Development Team', 'Electronics & Hardware Team', 'Software Development Team', 'Communications Team'],
    date: '2024-03-15',
    createdAt: '2024-01-01'
  }

  const displayProject = project || sampleProject

  if (loading) {
    return (
      <div className="pt-20 px-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading project...</p>
        </div>
      </div>
    )
  }

  if (!displayProject) {
    return (
      <div className="pt-20 px-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Project Not Found</h1>
          <Link href="/projects" className="btn-primary">
            Back to Projects
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link
            href="/projects"
            className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Projects
          </Link>
        </motion.div>

        {/* Project Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {displayProject.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-gray-300">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              <span>
                {new Date(displayProject.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              <span>{displayProject.contributors.length} Teams Involved</span>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8"
            >
              <div className="glass-card p-4 mb-4">
                <div className="relative h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg overflow-hidden">
                  <img 
                    src={displayProject.images[selectedImage]} 
                    alt={displayProject.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-8xl opacity-20">🚀</div>
                  </div>
                </div>
              </div>
              
              {/* Thumbnail Gallery */}
              {displayProject.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {displayProject.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === index ? 'border-blue-400' : 'border-white/20'
                      }`}
                    >
                      <img 
                        src={displayProject.images[index]} 
                        alt={`${displayProject.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                        <span className="text-2xl opacity-50">🚀</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="glass-card p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Project Overview</h2>
              <div className="text-gray-300 leading-relaxed space-y-4">
                {displayProject.description.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Technologies */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="glass-card p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4">Technologies Used</h3>
              <div className="space-y-2">
                {displayProject.technologies.map((tech, index) => (
                  <div
                    key={index}
                    className="flex items-center p-3 bg-white/10 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                    <span className="text-gray-300">{tech}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Contributors */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="glass-card p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4">Contributing Teams</h3>
              <div className="space-y-3">
                {displayProject.contributors.map((contributor, index) => (
                  <div
                    key={index}
                    className="flex items-center p-3 bg-white/10 rounded-lg"
                  >
                    <Users className="h-5 w-5 text-blue-400 mr-3" />
                    <span className="text-gray-300">{contributor}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Project Links */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="glass-card p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4">Project Resources</h3>
              <div className="space-y-3">
                <a
                  href="#"
                  className="flex items-center p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors group"
                >
                  <Github className="h-5 w-5 text-gray-400 group-hover:text-white mr-3" />
                  <span className="text-gray-300 group-hover:text-white">View Source Code</span>
                  <ExternalLink className="h-4 w-4 ml-auto text-gray-400 group-hover:text-white" />
                </a>
                <a
                  href="#"
                  className="flex items-center p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors group"
                >
                  <Play className="h-5 w-5 text-gray-400 group-hover:text-white mr-3" />
                  <span className="text-gray-300 group-hover:text-white">Project Demo</span>
                  <ExternalLink className="h-4 w-4 ml-auto text-gray-400 group-hover:text-white" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}