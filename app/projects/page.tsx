'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Users, ExternalLink, Search } from 'lucide-react'
import { getProjects } from '@/lib/db'
import { Project } from '@/lib/types'
import LikeComment from '@/components/LikeComment'
import { getCache, setCache } from '@/lib/cache'

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const cacheKey = 'projects_page_data'
        let projectsData = getCache(cacheKey)
        
        if (!projectsData) {
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 5000)
          
          try {
            projectsData = await getProjects()
            clearTimeout(timeoutId)
            setCache(cacheKey, projectsData, 300000)
          } catch (error) {
            clearTimeout(timeoutId)
            console.error('Error fetching projects:', error)
            projectsData = sampleProjects
          }
        }
        
        setProjects(projectsData)
        setFilteredProjects(projectsData)
      } catch (error) {
        console.error('Error fetching projects:', error)
        setProjects(sampleProjects)
        setFilteredProjects(sampleProjects)
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
    <div className="pt-16 sm:pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Our Projects
          </h1>
          <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-300 max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed">
            Explore our innovative space technology projects, from satellite development to 
            propulsion systems and everything in between.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors text-sm"
            />
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {displayProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card overflow-hidden group hover:bg-white/10 transition-all duration-300 flex flex-col"
            >
              {/* Project Image */}
              <div className="relative h-48 bg-gradient-to-br from-purple-500/20 to-blue-500/20 overflow-hidden flex-shrink-0">
                {project.images && project.images.length > 0 ? (
                  <Image 
                    src={project.images[0]} 
                    alt={project.title}
                    width={400}
                    height={200}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`absolute inset-0 flex items-center justify-center ${project.images && project.images.length > 0 ? 'hidden' : ''}`}>
                  <div className="text-4xl opacity-20">🚀</div>
                </div>
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-lg p-2 border border-white/20">
                  <Calendar className="h-4 w-4 text-white" />
                </div>
              </div>

              {/* Project Content */}
              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors line-clamp-2">
                  {project.title}
                </h3>
                
                <p className="text-sm text-gray-300 mb-4 line-clamp-2 leading-relaxed flex-1">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 3).map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-lg border border-purple-500/30"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-2 py-1 bg-gray-500/20 text-gray-300 text-xs rounded-lg border border-gray-500/30">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Project Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-400 text-sm">
                    <Users className="h-4 w-4 mr-2 text-blue-400 flex-shrink-0" />
                    <span>{project.contributors.length} teams</span>
                  </div>
                  <div className="flex items-center text-gray-400 text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-green-400 flex-shrink-0" />
                    <span>
                      {new Date(project.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-auto space-y-3">
                  {/* Action Button */}
                  <Link
                    href={`/projects/${project.id}`}
                    className="inline-flex items-center justify-center w-full px-4 py-2 bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 rounded-lg transition-colors font-semibold text-sm border border-purple-500/30"
                  >
                    Read More
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>

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
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredProjects.length === 0 && searchTerm && (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-400 text-base sm:text-lg">
              No projects found matching "{searchTerm}"
            </p>
          </div>
        )}
      </div>
    </div>
  )
}