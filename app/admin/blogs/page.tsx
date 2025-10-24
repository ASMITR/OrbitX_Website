'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Calendar, User, Eye } from 'lucide-react'
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
          <div className="glass-card p-8 text-center">
            <p className="text-gray-400">No blogs found. Create your first blog post!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="glass-card group hover:scale-105 transition-all duration-300"
              >
                <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                    {blog.title}
                  </h3>
                  
                  <p className="text-gray-300 mb-4 line-clamp-3 text-sm">
                    {blog.excerpt}
                  </p>
                  
                  <div className="flex items-center text-xs text-gray-400 mb-4">
                    <User className="h-3 w-3 mr-1" />
                    <span className="mr-4">{blog.author}</span>
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2 relative z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          window.open(`/blogs/${blog.id}`, '_blank')
                        }}
                        className="p-2 text-gray-400 hover:text-blue-400 transition-colors cursor-pointer"
                        title="View Blog"
                        type="button"
                      >
                        <Eye className="h-4 w-4 pointer-events-none" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEdit(blog)
                        }}
                        className="p-2 text-gray-400 hover:text-yellow-400 transition-colors cursor-pointer"
                        title="Edit Blog"
                        type="button"
                      >
                        <Edit className="h-4 w-4 pointer-events-none" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(blog.id)
                        }}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete Blog"
                        type="button"
                      >
                        <Trash2 className="h-4 w-4 pointer-events-none" />
                      </button>
                    </div>
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