'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Calendar, User, Eye, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { getBlogs, deleteBlog } from '@/lib/db'
import { Blog } from '@/lib/types'
import AdminLayout from '@/components/admin/AdminLayout'
import BlogModal from './BlogModal'
import toast from 'react-hot-toast'

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null)

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      const blogsData = await getBlogs()
      setBlogs(blogsData)
    } catch (error) {
      console.error('Error fetching blogs:', error)
      toast.error('Failed to fetch blogs')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this blog?')) {
      try {
        await deleteBlog(id)
        setBlogs(blogs.filter(blog => blog.id !== id))
        toast.success('Blog deleted successfully')
      } catch (error) {
        console.error('Error deleting blog:', error)
        toast.error('Failed to delete blog')
      }
    }
  }

  const handleEdit = (blog: Blog) => {
    console.log('Edit clicked for blog:', blog.id)
    setEditingBlog(blog)
    setModalOpen(true)
  }

  const handleAdd = () => {
    setEditingBlog(null)
    setModalOpen(true)
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setEditingBlog(null)
    fetchBlogs()
  }

  if (loading) {
    return (
      <AdminLayout title="Blogs">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Blogs">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Manage Blogs</h2>
            <p className="text-gray-400">Create and manage blog posts</p>
          </div>
          <button
            onClick={handleAdd}
            className="btn-primary flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Blog
          </button>
        </div>

        {/* Blogs List */}
        {blogs.length === 0 ? (
          <div className="glass-card-admin p-8 text-center">
            <p className="text-gray-400">No blogs found. Create your first blog post!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {blogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card-admin hover:border-orange-400/50 transition-all duration-300 group flex flex-col overflow-hidden"
              >
                {/* Blog Image */}
                <div className="relative h-48 flex-shrink-0 overflow-hidden">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-green-500/30 text-green-200 text-xs font-semibold rounded-full backdrop-blur-sm border border-green-400/50">
                      Published
                    </span>
                  </div>
                </div>
                
                {/* Blog Content */}
                <div className="p-4 sm:p-6 flex flex-col flex-1">
                  <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 group-hover:text-orange-300 transition-colors">
                    {blog.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed flex-1">
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
                  
                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
                    <div className="flex items-center space-x-2">
                      <motion.button
                        onClick={() => window.open(`/blogs/${blog.id}`, '_blank')}
                        className="p-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Eye className="h-4 w-4" />
                      </motion.button>
                      <motion.button
                        onClick={() => handleEdit(blog)}
                        className="p-2 bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 rounded-lg transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Edit className="h-4 w-4" />
                      </motion.button>
                      <motion.button
                        onClick={() => handleDelete(blog.id)}
                        className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </motion.button>
                    </div>
                    
                    {/* Tags indicator */}
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="text-xs text-gray-500">
                        {blog.tags.length} tags
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Blog Modal */}
      {modalOpen && (
        <BlogModal
          blog={editingBlog}
          onClose={handleModalClose}
        />
      )}
    </AdminLayout>
  )
}