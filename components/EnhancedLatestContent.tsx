'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, User, ArrowRight, Tag, Eye, Heart } from 'lucide-react'
import { Event, Project, Blog } from '@/lib/types'

interface Props {
  events: Event[]
  projects: Project[]
  blogs: Blog[]
}

export default function EnhancedLatestContent({ events, projects, blogs }: Props) {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-900/50 to-gray-800/30">
      <div className="max-w-7xl mx-auto">
        {/* Latest Events */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                Latest Events
              </h2>
              <p className="text-gray-400">Upcoming space exploration events and workshops</p>
            </div>
            <Link href="/events" className="btn-primary flex items-center">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.slice(0, 3).map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <div className="glass-card overflow-hidden h-full">
                  <div className="relative h-48 overflow-hidden">
                    {event.images?.[0] ? (
                      <Image
                        src={event.images[0]}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                        <Calendar className="h-16 w-16 text-blue-400/50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-blue-500/80 text-white text-sm rounded-full backdrop-blur-sm">
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                      {event.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {event.organizer}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(event.date).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Latest Projects */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                Featured Projects
              </h2>
              <p className="text-gray-400">Innovative space technology developments</p>
            </div>
            <Link href="/projects" className="btn-primary flex items-center">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {projects.slice(0, 2).map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <div className="glass-card overflow-hidden h-full">
                  <div className="md:flex">
                    <div className="md:w-1/2 relative h-64 md:h-auto overflow-hidden">
                      {project.images?.[0] ? (
                        <Image
                          src={project.images[0]}
                          alt={project.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                          <Tag className="h-16 w-16 text-purple-400/50" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                    
                    <div className="md:w-1/2 p-6 flex flex-col justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-gray-300 mb-4 line-clamp-3">
                          {project.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.technologies?.slice(0, 3).map((tech, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-500/30"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.technologies?.length > 3 && (
                            <span className="px-3 py-1 bg-gray-500/20 text-gray-300 text-xs rounded-full">
                              +{project.technologies.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <span>{new Date(project.date).toLocaleDateString()}</span>
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Latest Blogs */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-2">
                Latest Insights
              </h2>
              <p className="text-gray-400">Space exploration stories and technical insights</p>
            </div>
            <Link href="/blogs" className="btn-primary flex items-center">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.slice(0, 3).map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <div className="glass-card overflow-hidden h-full">
                  <div className="relative h-48 overflow-hidden">
                    {blog.image ? (
                      <Image
                        src={blog.image}
                        alt={blog.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-green-500/20 to-blue-500/20 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-green-400/50 mb-2">
                            {blog.title.charAt(0)}
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center space-x-2">
                        <Heart className="h-4 w-4 text-red-400" />
                        <span className="text-white text-sm">{blog.likes || 0}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      {blog.category && (
                        <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded mr-3">
                          {blog.category}
                        </span>
                      )}
                      <span className="text-gray-400 text-xs">
                        {blog.readTime || '5'} min read
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                      {blog.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {blog.author}
                      </div>
                      <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}