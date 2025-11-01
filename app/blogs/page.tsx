'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, User, Tag, Search } from 'lucide-react'
import { getBlogs } from '@/lib/db'
import { Blog } from '@/lib/types'
import LikeComment from '@/components/LikeComment'
import { getCache, setCache } from '@/lib/cache'

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  // Sample blogs for demonstration
  const sampleBlogs: Blog[] = [
    {
      id: '1',
      title: 'The Future of CubeSat Technology',
      excerpt: 'Exploring how miniaturized satellites are revolutionizing space exploration and making it more accessible to educational institutions.',
      content: 'Full blog content here...',
      image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=600&h=400&fit=crop',
      author: 'OrbitX Research Team',
      publishedAt: '2024-03-15',
      tags: ['CubeSat', 'Technology', 'Space'],
      createdAt: '2024-03-15'
    },
    {
      id: '2',
      title: 'Mission Control: Behind the Scenes',
      excerpt: 'Take a look at what goes on in our mission control center during satellite operations and how we ensure successful missions.',
      content: 'Full blog content here...',
      image: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=600&h=400&fit=crop',
      author: 'Operations Team',
      publishedAt: '2024-03-10',
      tags: ['Mission Control', 'Operations', 'Satellites'],
      createdAt: '2024-03-10'
    }
  ]

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const cacheKey = 'blogs_page_data'
        let blogsData = getCache(cacheKey)
        
        if (!blogsData) {
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 5000)
          
          try {
            blogsData = await getBlogs()
            clearTimeout(timeoutId)
            setCache(cacheKey, blogsData, 300000)
          } catch (error) {
            clearTimeout(timeoutId)
            console.error('Error fetching blogs:', error)
            blogsData = sampleBlogs
          }
        }
        
        setBlogs(blogsData)
        setFilteredBlogs(blogsData)
      } catch (error) {
        console.error('Error fetching blogs:', error)
        setBlogs(sampleBlogs)
        setFilteredBlogs(sampleBlogs)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  useEffect(() => {
    const filtered = blogs.filter(blog =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    setFilteredBlogs(filtered)
  }, [searchTerm, blogs])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-20 pb-8 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3 sm:mb-4">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Blog</span>
          </h1>
          <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Discover the latest insights, updates, and stories from the OrbitX community
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8 sm:mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-colors text-sm"
            />
          </div>
        </div>

        {/* Blogs Grid */}
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-400 text-base sm:text-lg">No blogs found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {filteredBlogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card group hover:bg-white/10 transition-all duration-300 flex flex-col overflow-hidden"
              >
                <Link href={`/blogs/${blog.id}`} className="flex flex-col h-full">
                  {/* Blog Image */}
                  <div className="relative h-48 flex-shrink-0 overflow-hidden">
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      width={400}
                      height={200}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    
                    {/* Published Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 bg-orange-500/30 text-orange-200 text-xs font-semibold rounded-full backdrop-blur-sm border border-orange-400/50">
                        Published
                      </span>
                    </div>
                  </div>
                  
                  {/* Blog Content */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-orange-300 transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                    
                    <p className="text-sm text-gray-300 mb-4 line-clamp-2 leading-relaxed flex-1">
                      {blog.excerpt}
                    </p>
                    
                    {/* Blog Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-400 text-sm">
                        <User className="h-4 w-4 mr-2 text-orange-400 flex-shrink-0" />
                        <span className="truncate">{blog.author}</span>
                      </div>
                      <div className="flex items-center text-gray-400 text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-blue-400 flex-shrink-0" />
                        <span>
                          {new Date(blog.publishedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                    
                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {blog.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2 py-1 rounded-lg text-xs bg-orange-500/20 text-orange-300 border border-orange-500/30"
                          >
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                        {blog.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-500/20 text-gray-300 text-xs rounded-lg border border-gray-500/30">
                            +{blog.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                    
                    {/* Bottom Section */}
                    <div className="mt-auto space-y-3">
                      {/* Read More Button */}
                      <div className="inline-flex items-center justify-center w-full px-4 py-2 bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 rounded-lg transition-colors font-semibold text-sm border border-orange-500/30">
                        Read More
                        <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>

                      {/* Like and Comment */}
                      <LikeComment
                        collection="blogs"
                        id={blog.id}
                        likes={blog.likes || 0}
                        likedBy={blog.likedBy || []}
                        comments={blog.comments || []}
                        onUpdate={(likes, likedBy, comments) => {
                          setBlogs(prev => prev.map(b => b.id === blog.id ? { ...b, likes, likedBy, comments } : b))
                          setFilteredBlogs(prev => prev.map(b => b.id === blog.id ? { ...b, likes, likedBy, comments } : b))
                        }}
                      />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}