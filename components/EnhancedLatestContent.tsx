'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, User, ArrowRight, Tag, Eye, Heart, MessageCircle, Share2, Bookmark } from 'lucide-react'
import { Event, Project, Blog } from '@/lib/types'
import toast from 'react-hot-toast'

interface Props {
  events: Event[]
  projects: Project[]
  blogs: Blog[]
}

export default function EnhancedLatestContent({ events, projects, blogs }: Props) {
  const [eventLikes, setEventLikes] = useState<{[key: string]: boolean}>({})
  const [projectLikes, setProjectLikes] = useState<{[key: string]: boolean}>({})
  const [blogLikes, setBlogLikes] = useState<{[key: string]: boolean}>({})
  const [bookmarks, setBookmarks] = useState<{[key: string]: boolean}>({})

  const handleLike = (type: 'event' | 'project' | 'blog', id: string) => {
    if (type === 'event') {
      setEventLikes(prev => ({ ...prev, [id]: !prev[id] }))
    } else if (type === 'project') {
      setProjectLikes(prev => ({ ...prev, [id]: !prev[id] }))
    } else {
      setBlogLikes(prev => ({ ...prev, [id]: !prev[id] }))
    }
    const isLiked = type === 'event' ? !eventLikes[id] : type === 'project' ? !projectLikes[id] : !blogLikes[id]
    toast.success(isLiked ? 'Liked!' : 'Unliked!')
  }

  const handleComment = (type: string, title: string) => {
    toast.success(`Opening comments for ${title}`)
  }

  const handleShare = async (title: string, id: string, type: string) => {
    const url = `${window.location.origin}/${type}s/${id}`
    try {
      await navigator.share({ title, url })
    } catch {
      await navigator.clipboard.writeText(url)
      toast.success('Link copied to clipboard!')
    }
  }

  const handleBookmark = (id: string) => {
    setBookmarks(prev => ({ ...prev, [id]: !prev[id] }))
    toast.success(bookmarks[id] ? 'Removed from bookmarks' : 'Added to bookmarks')
  }

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/8 to-purple-500/8 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-500/8 to-teal-500/8 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 0.8, 1.2],
            x: [0, -40, 0],
            y: [0, 20, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Latest Events */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="flex items-center justify-between mb-12">
            <div>
              <motion.h2 
                className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{ duration: 5, repeat: Infinity }}
                style={{ backgroundSize: '200% 100%' }}
              >
                Latest Events
              </motion.h2>
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
                <Link href={`/events/${event.id}`} className="block h-full">
                  <div className="glass-card overflow-hidden h-full cursor-pointer hover:shadow-2xl hover:shadow-blue-500/20 border border-white/10 hover:border-blue-400/30 transition-all duration-500">
                    <div className="relative h-56 overflow-hidden">
                      {event.images?.[0] ? (
                        <Image
                          src={event.images[0]}
                          alt={event.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700 w-full h-full"
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
                      <div className="absolute top-4 right-4 flex space-x-2">
                        <div className="flex items-center space-x-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                          <Heart className="h-3 w-3 text-red-400" />
                          <span className="text-white text-xs">{(event.likes || 0) + (eventLikes[event.id] ? 1 : 0)}</span>
                        </div>
                        <div className="flex items-center space-x-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                          <MessageCircle className="h-3 w-3 text-blue-400" />
                          <span className="text-white text-xs">{Array.isArray(event.comments) ? event.comments.length : event.comments || 0}</span>
                        </div>
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
                        <div className="flex items-center space-x-3">
                          <div 
                            className="flex items-center space-x-1 hover:text-red-400 cursor-pointer transition-colors"
                            onClick={() => handleLike('event', event.id)}
                          >
                            <Heart className={`h-4 w-4 ${eventLikes[event.id] ? 'fill-red-400 text-red-400' : ''}`} />
                            <span>{(event.likes || 0) + (eventLikes[event.id] ? 1 : 0)}</span>
                          </div>
                          <div 
                            className="flex items-center space-x-1 hover:text-blue-400 cursor-pointer transition-colors"
                            onClick={() => handleComment('event', event.title)}
                          >
                            <MessageCircle className="h-4 w-4" />
                            <span>{Array.isArray(event.comments) ? event.comments.length : event.comments || 0}</span>
                          </div>
                          <Share2 
                            className="h-4 w-4 hover:text-green-400 cursor-pointer transition-colors" 
                            onClick={() => handleShare(event.title, event.id, 'event')}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
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
              <motion.h2 
                className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{ duration: 5, repeat: Infinity }}
                style={{ backgroundSize: '200% 100%' }}
              >
                Featured Projects
              </motion.h2>
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
                <Link href={`/projects/${project.id}`} className="block h-full">
                  <div className="glass-card overflow-hidden h-full cursor-pointer hover:shadow-2xl hover:shadow-purple-500/20 border border-white/10 hover:border-purple-400/30 transition-all duration-500">
                    <div className="md:flex">
                      <div className="md:w-1/2 relative h-72 md:h-auto overflow-hidden">
                        {project.images?.[0] ? (
                          <Image
                            src={project.images[0]}
                            alt={project.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700 w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                            <Tag className="h-16 w-16 text-purple-400/50" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>
                      
                      <div className="md:w-1/2 p-8 flex flex-col justify-between bg-gradient-to-br from-black/10 to-transparent">
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
                          <div className="flex items-center space-x-3">
                            <div 
                              className="flex items-center space-x-1 hover:text-red-400 cursor-pointer transition-colors"
                              onClick={() => handleLike('project', project.id)}
                            >
                              <Heart className={`h-4 w-4 ${projectLikes[project.id] ? 'fill-red-400 text-red-400' : ''}`} />
                              <span>{(project.likes || 0) + (projectLikes[project.id] ? 1 : 0)}</span>
                            </div>
                            <div 
                              className="flex items-center space-x-1 hover:text-blue-400 cursor-pointer transition-colors"
                              onClick={() => handleComment('project', project.title)}
                            >
                              <MessageCircle className="h-4 w-4" />
                              <span>{Array.isArray(project.comments) ? project.comments.length : project.comments || 0}</span>
                            </div>
                            <Bookmark 
                              className={`h-4 w-4 cursor-pointer transition-colors ${
                                bookmarks[project.id] ? 'text-yellow-400' : 'hover:text-yellow-400'
                              }`}
                              onClick={() => handleBookmark(project.id)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
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
              <motion.h2 
                className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-2"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{ duration: 5, repeat: Infinity }}
                style={{ backgroundSize: '200% 100%' }}
              >
                Latest Insights
              </motion.h2>
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
                <Link href={`/blogs/${blog.id}`} className="block h-full">
                  <div className="glass-card overflow-hidden h-full cursor-pointer hover:shadow-2xl hover:shadow-green-500/20 border border-white/10 hover:border-green-400/30 transition-all duration-500">
                    <div className="relative h-56 overflow-hidden">
                      {blog.image ? (
                        <Image
                          src={blog.image}
                          alt={blog.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700 w-full h-full"
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
                      <div className="absolute top-4 right-4 flex space-x-2">
                        <div className="flex items-center space-x-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                          <Heart className="h-3 w-3 text-red-400" />
                          <span className="text-white text-xs">{(blog.likes || 0) + (blogLikes[blog.id] ? 1 : 0)}</span>
                        </div>
                        <div className="flex items-center space-x-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                          <MessageCircle className="h-3 w-3 text-blue-400" />
                          <span className="text-white text-xs">{Array.isArray(blog.comments) ? blog.comments.length : blog.comments || 0}</span>
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
                        <div className="flex items-center space-x-3">
                          <div 
                            className="flex items-center space-x-1 hover:text-red-400 cursor-pointer transition-colors"
                            onClick={() => handleLike('blog', blog.id)}
                          >
                            <Heart className={`h-4 w-4 ${blogLikes[blog.id] ? 'fill-red-400 text-red-400' : ''}`} />
                            <span>{(blog.likes || 0) + (blogLikes[blog.id] ? 1 : 0)}</span>
                          </div>
                          <div 
                            className="flex items-center space-x-1 hover:text-blue-400 cursor-pointer transition-colors"
                            onClick={() => handleComment('blog', blog.title)}
                          >
                            <MessageCircle className="h-4 w-4" />
                            <span>{Array.isArray(blog.comments) ? blog.comments.length : blog.comments || 0}</span>
                          </div>
                          <Share2 
                            className="h-4 w-4 hover:text-green-400 cursor-pointer transition-colors" 
                            onClick={() => handleShare(blog.title, blog.id, 'blog')}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}