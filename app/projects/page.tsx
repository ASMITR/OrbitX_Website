'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Users, ExternalLink, Search } from 'lucide-react'
import { getProjects } from '@/lib/db'
import { Project } from '@/lib/types'
import LikeComment from '@/components/LikeComment'

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsData = await getProjects()
        setProjects(projectsData)
        setFilteredProjects(projectsData)
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  useEffect(() => {
    const filtered = projects.filter(project =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    setFilteredProjects(filtered)
  }, [searchTerm, projects])

  // Sample projects for demonstration
  const sampleProjects: Project[] = [
    {
      id: '1',
      title: 'CubeSat-1 Mission',
      description: 'Our first CubeSat project focused on Earth observation and atmospheric data collection. This 1U CubeSat features advanced imaging capabilities and real-time data transmission.',
      images: ['https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=300&fit=crop'],
      technologies: ['Arduino', 'C++', 'RF Communication', 'Solar Panels'],
      contributors: ['Satellite Team', 'Electronics Team', 'Software Team'],
      date: '2024-03-15',
      createdAt: '2024-01-01'
    },
    {
      id: '2',
      title: 'Hybrid Rocket Engine',
      description: 'Development of a hybrid rocket engine using solid fuel and liquid oxidizer. This project aims to create a cost-effective and safe propulsion system for small satellites.',
      images: ['https://images.unsplash.com/photo-1517976487492-5750f3195933?w=400&h=300&fit=crop'],
      technologies: ['CAD Design', 'Fluid Dynamics', 'Materials Science', 'Testing'],
      contributors: ['Propulsion Team', 'R&D Team'],
      date: '2024-02-20',
      createdAt: '2024-01-15'
    },
    {
      id: '3',
      title: 'Ground Station Network',
      description: 'Establishing a network of ground stations for satellite communication. This project includes antenna design, signal processing, and automated tracking systems.',
      images: ['https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop'],
      technologies: ['RF Engineering', 'Python', 'Signal Processing', 'Automation'],
      contributors: ['Communications Team', 'Software Team'],
      date: '2024-01-10',
      createdAt: '2023-12-01'
    },
    {
      id: '4',
      title: 'Mission Control Dashboard',
      description: 'A comprehensive web-based dashboard for monitoring and controlling satellite missions. Features real-time telemetry, command interface, and data visualization.',
      images: ['https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=400&h=300&fit=crop'],
      technologies: ['React', 'Node.js', 'WebSocket', 'D3.js', 'MongoDB'],
      contributors: ['Software Team', 'Communications Team'],
      date: '2023-12-05',
      createdAt: '2023-11-01'
    },
    {
      id: '5',
      title: 'Advanced Materials Research',
      description: 'Research into lightweight, radiation-resistant materials for space applications. Focus on developing composite materials for satellite structures.',
      images: ['https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=400&h=300&fit=crop'],
      technologies: ['Materials Science', 'Testing', 'Analysis', 'CAD'],
      contributors: ['R&D Team', 'Satellite Team'],
      date: '2023-11-20',
      createdAt: '2023-10-01'
    },
    {
      id: '6',
      title: 'Ion Thruster Development',
      description: 'Development of an electric propulsion system using ion thruster technology. This project focuses on creating efficient propulsion for long-duration missions.',
      images: ['https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop'],
      technologies: ['Plasma Physics', 'Electronics', 'Vacuum Systems', 'Control Systems'],
      contributors: ['Propulsion Team', 'Electronics Team'],
      date: '2023-10-15',
      createdAt: '2023-09-01'
    }
  ]

  const displayProjects = filteredProjects.length > 0 ? filteredProjects : sampleProjects

  if (loading) {
    return (
      <div className="pt-20 px-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading projects...</p>
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
            Our Projects
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Explore our innovative space technology projects, from satellite development to 
            propulsion systems and everything in between.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
            />
          </div>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="glass-card overflow-hidden group"
            >
              {/* Project Image */}
              <div className="relative aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 overflow-hidden">
                {project.images && project.images.length > 0 ? (
                  <Image 
                    src={project.images[0]} 
                    alt={project.title}
                    width={400}
                    height={300}
                    className="w-full h-full object-contain bg-gray-900/50"
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`absolute inset-0 flex items-center justify-center ${project.images && project.images.length > 0 ? 'hidden' : ''}`}>
                  <div className="text-6xl opacity-20">🚀</div>
                </div>
                <div className="absolute top-4 right-4 bg-black/50 rounded-full p-2">
                  <Calendar className="h-4 w-4 text-white" />
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-gray-300 mb-4 line-clamp-3">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 3).map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-2 py-1 bg-gray-500/20 text-gray-300 text-xs rounded-full">
                        +{project.technologies.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Contributors */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-400 text-sm">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{project.contributors.length} teams</span>
                  </div>
                  
                  <Link
                    href={`/projects/${project.id}`}
                    className="flex items-center text-blue-400 hover:text-blue-300 transition-colors text-sm font-semibold"
                  >
                    Read More
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </Link>
                </div>

                {/* Date */}
                <div className="mt-3 pt-3 border-t border-white/10 mb-4">
                  <span className="text-gray-400 text-sm">
                    {new Date(project.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>

                {/* Like and Comment */}
                <LikeComment
                  collection="projects"
                  id={project.id}
                  likes={project.likes || 0}
                  likedBy={project.likedBy || []}
                  comments={project.comments || []}
                  onUpdate={(likes, likedBy, comments) => {
                    setProjects(prev => prev.map(p => p.id === project.id ? { ...p, likes, likedBy, comments } : p))
                    setFilteredProjects(prev => prev.map(p => p.id === project.id ? { ...p, likes, likedBy, comments } : p))
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredProjects.length === 0 && searchTerm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-400 text-lg">
              No projects found matching "{searchTerm}"
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}