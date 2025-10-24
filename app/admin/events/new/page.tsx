'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { ArrowLeft, Upload, X, Calendar, Save } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'

import toast from 'react-hot-toast'

interface EventForm {
  title: string
  date: string
  description: string
  organizer: string
  videoUrl?: string
}

export default function AddEvent() {
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [uploadProgress, setUploadProgress] = useState<number[]>([])
  const [coverImageIndex, setCoverImageIndex] = useState<number>(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { register, handleSubmit, formState: { errors } } = useForm<EventForm>()

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + images.length > 5) {
      toast.error('Maximum 5 images allowed')
      return
    }

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`)
        continue
      }

      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'orbitx/events')

      try {
        const response = await fetch('/api/upload/cloudinary', {
          method: 'POST',
          body: formData
        })
        
        if (response.ok) {
          const { url } = await response.json()
          setImages(prev => [...prev, file])
          setImagePreviews(prev => [...prev, url])
        }
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`)
      }
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: EventForm) => {
    setIsSubmitting(true)
    try {
      const imageUrls: string[] = imagePreviews
      const coverImage = imageUrls[coverImageIndex] || imageUrls[0]
      
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          images: imageUrls,
          coverImage,
          createdAt: new Date().toISOString()
        })
      })
      
      if (!response.ok) throw new Error('Failed to create event')
      
      toast.success('Event created successfully!')
      router.push('/admin/events')
    } catch (error) {
      console.error('Error creating event:', error)
      toast.error('Failed to create event')
      toast.dismiss('upload')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AdminLayout title="Add New Event">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-white">Add New Event</h2>
            <p className="text-gray-400">Create a new event or workshop</p>
          </div>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Event Title *
                </label>
                <input
                  {...register('title', { required: 'Title is required' })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                  placeholder="Enter event title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-400">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Date & Time *
                </label>
                <input
                  type="datetime-local"
                  {...register('date', { required: 'Date is required' })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 transition-colors"
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-400">{errors.date.message}</p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Organizer *
                </label>
                <input
                  {...register('organizer', { required: 'Organizer is required' })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                  placeholder="e.g., OrbitX Education Team"
                />
                {errors.organizer && (
                  <p className="mt-1 text-sm text-red-400">{errors.organizer.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Video URL (Optional)
                </label>
                <input
                  {...register('videoUrl')}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                  placeholder="YouTube embed URL"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                rows={6}
                maxLength={1000}
                {...register('description', { required: 'Description is required', maxLength: { value: 1000, message: 'Description must be less than 1000 characters' } })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors resize-none"
                placeholder="Describe the event, agenda, what attendees will learn, etc. (Max 1000 characters)"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-400">{errors.description.message}</p>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Event Images (Max 5)
              </label>
              
              <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-gray-300 mb-1">Click to upload images</p>
                  <p className="text-gray-400 text-sm">PNG, JPG up to 5MB each</p>
                </label>
              </div>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-300">Select cover image:</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className={`w-full h-24 object-cover rounded-lg cursor-pointer transition-all ${
                            coverImageIndex === index ? 'ring-2 ring-blue-400' : ''
                          }`}
                          onClick={() => setCoverImageIndex(index)}
                        />
                        {coverImageIndex === index && (
                          <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                            Cover
                          </div>
                        )}
                        {uploadProgress[index] > 0 && uploadProgress[index] < 100 && (
                          <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                            <div className="text-white text-sm">{Math.round(uploadProgress[index])}%</div>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-white/10">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 border border-white/20 text-gray-300 rounded-lg hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    Create Event
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AdminLayout>
  )
}