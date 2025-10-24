'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Upload, Tag, Calendar } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '@/lib/firebase'
import { addBlog, updateBlog } from '@/lib/db'
import { Blog } from '@/lib/types'
import toast from 'react-hot-toast'

interface BlogModalProps {
  blog?: Blog | null
  onClose: () => void
}

interface BlogForm {
  title: string
  content: string
  excerpt: string
  author: string
  tags: string
  publishedAt: string
}

export default function BlogModal({ blog, onClose }: BlogModalProps) {
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<BlogForm>()

  useEffect(() => {
    if (blog) {
      setValue('title', blog.title)
      setValue('content', blog.content)
      setValue('excerpt', blog.excerpt)
      setValue('author', blog.author)
      setValue('tags', blog.tags.join(', '))
      setValue('publishedAt', blog.publishedAt.split('T')[0])
      setImagePreview(blog.image)
    } else {
      setValue('publishedAt', new Date().toISOString().split('T')[0])
    }
  }, [blog, setValue])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'orbitx/blogs')

    const response = await fetch('/api/upload/cloudinary', {
      method: 'POST',
      body: formData
    })
    
    if (!response.ok) throw new Error('Upload failed')
    
    const result = await response.json()
    return result.url
  }

  const onSubmit = async (data: BlogForm) => {
    setLoading(true)
    try {
      let imageUrl = blog?.image || ''
      
      if (imageFile) {
        imageUrl = await uploadImage(imageFile)
      }

      if (!imageUrl) {
        toast.error('Please select an image')
        setLoading(false)
        return
      }

      const blogData = {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        author: data.author,
        tags: data.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        publishedAt: data.publishedAt,
        image: imageUrl,
        coverImage: imageUrl,
        createdAt: blog?.createdAt || new Date().toISOString()
      }

      if (blog) {
        await updateBlog(blog.id, blogData)
        toast.success('Blog updated successfully')
      } else {
        await addBlog(blogData)
        toast.success('Blog created successfully')
      }

      onClose()
    } catch (error) {
      console.error('Error saving blog:', error)
      toast.error('Failed to save blog')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="glass-card w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white">
            {blog ? 'Edit Blog' : 'Create New Blog'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                {...register('title', { required: 'Title is required' })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                placeholder="Enter blog title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-400">{errors.title.message}</p>
              )}
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Author *
              </label>
              <input
                type="text"
                {...register('author', { required: 'Author is required' })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                placeholder="Enter author name"
              />
              {errors.author && (
                <p className="mt-1 text-sm text-red-400">{errors.author.message}</p>
              )}
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Excerpt *
            </label>
            <textarea
              {...register('excerpt', { required: 'Excerpt is required' })}
              rows={3}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors resize-none"
              placeholder="Brief description of the blog post"
            />
            {errors.excerpt && (
              <p className="mt-1 text-sm text-red-400">{errors.excerpt.message}</p>
            )}
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Content *
            </label>
            <textarea
              {...register('content', { required: 'Content is required' })}
              rows={10}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors resize-none"
              placeholder="Write your blog content here..."
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-400">{errors.content.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Tag className="inline h-4 w-4 mr-1" />
                Tags
              </label>
              <input
                type="text"
                {...register('tags')}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                placeholder="Enter tags separated by commas"
              />
            </div>

            {/* Published Date */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Published Date *
              </label>
              <input
                type="date"
                {...register('publishedAt', { required: 'Published date is required' })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 transition-colors"
              />
              {errors.publishedAt && (
                <p className="mt-1 text-sm text-red-400">{errors.publishedAt.message}</p>
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Upload className="inline h-4 w-4 mr-1" />
              Featured Image *
            </label>
            <div className="space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600 transition-colors"
              />
              {imagePreview && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {blog ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                blog ? 'Update Blog' : 'Create Blog'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}