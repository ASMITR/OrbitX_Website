'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, X, Plus } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Merchandise } from '@/lib/types'
import toast from 'react-hot-toast'

export default function EditMerchandisePage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [merchandise, setMerchandise] = useState<Merchandise | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    sizes: [] as string[],
    colors: [] as string[],
    inStock: true,
    stockQuantity: '',
    featured: false
  })
  const [images, setImages] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [newSize, setNewSize] = useState('')
  const [newColor, setNewColor] = useState('')

  useEffect(() => {
    if (params.id) {
      fetchMerchandise(params.id as string)
    }
  }, [params.id])

  const fetchMerchandise = async (id: string) => {
    try {
      const response = await fetch(`/api/merchandise/${id}`)
      if (response.ok) {
        const data = await response.json()
        setMerchandise(data)
        setFormData({
          name: data.name,
          description: data.description,
          price: data.price.toString(),
          category: data.category,
          sizes: data.sizes || [],
          colors: data.colors || [],
          inStock: data.inStock,
          stockQuantity: data.stockQuantity?.toString() || '',
          featured: data.featured || false
        })
        setExistingImages(data.images || [])
      } else {
        toast.error('Merchandise not found')
        router.push('/admin/merchandise')
      }
    } catch (error) {
      console.error('Error fetching merchandise:', error)
      toast.error('Failed to load merchandise')
      router.push('/admin/merchandise')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + images.length + existingImages.length > 5) {
      toast.error('Maximum 5 images allowed')
      return
    }

    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Each image must be less than 5MB')
        return
      }
    })

    setImages(prev => [...prev, ...files])
    
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index))
  }

  const removeNewImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const addSize = () => {
    if (newSize.trim() && !formData.sizes.includes(newSize.trim())) {
      setFormData(prev => ({
        ...prev,
        sizes: [...prev.sizes, newSize.trim()]
      }))
      setNewSize('')
    }
  }

  const removeSize = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter(s => s !== size)
    }))
  }

  const addColor = () => {
    if (newColor.trim() && !formData.colors.includes(newColor.trim())) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, newColor.trim()]
      }))
      setNewColor('')
    }
  }

  const removeColor = (color: string) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter(c => c !== color)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.description.trim() || !formData.price || !formData.category.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    if (existingImages.length === 0 && images.length === 0) {
      toast.error('Please add at least one image')
      return
    }

    setSaving(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name.trim())
      formDataToSend.append('description', formData.description.trim())
      formDataToSend.append('price', formData.price)
      formDataToSend.append('category', formData.category.trim())
      formDataToSend.append('inStock', formData.inStock.toString())
      formDataToSend.append('featured', formData.featured.toString())
      
      if (formData.stockQuantity) {
        formDataToSend.append('stockQuantity', formData.stockQuantity)
      }
      
      if (formData.sizes.length > 0) {
        formDataToSend.append('sizes', JSON.stringify(formData.sizes))
      }
      
      if (formData.colors.length > 0) {
        formDataToSend.append('colors', JSON.stringify(formData.colors))
      }

      formDataToSend.append('existingImages', JSON.stringify(existingImages))

      images.forEach((image, index) => {
        formDataToSend.append(`image${index}`, image)
      })

      const response = await fetch(`/api/merchandise/${params.id}`, {
        method: 'PUT',
        body: formDataToSend
      })

      if (response.ok) {
        toast.success('Merchandise updated successfully!')
        router.push('/admin/merchandise')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update merchandise')
      }
    } catch (error) {
      console.error('Error updating merchandise:', error)
      toast.error('Failed to update merchandise')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Edit Merchandise">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        </div>
      </AdminLayout>
    )
  }

  if (!merchandise) {
    return (
      <AdminLayout title="Edit Merchandise">
        <div className="text-center py-20">
          <h3 className="text-xl font-bold text-gray-400 mb-2">Merchandise not found</h3>
          <button onClick={() => router.push('/admin/merchandise')} className="btn-primary">
            Back to Merchandise
          </button>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Edit Merchandise">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4 text-gray-400" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">Edit Merchandise</h1>
            <p className="text-sm text-gray-400">Update merchandise information</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="glass-card-admin p-6">
            <h2 className="text-xl font-bold text-white mb-6">Basic Information</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                placeholder="Describe the product..."
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category *
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                  placeholder="e.g., T-Shirts, Hoodies, Accessories"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  name="stockQuantity"
                  value={formData.stockQuantity}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                  placeholder="Optional"
                  min="0"
                />
              </div>
            </div>

            <div className="flex gap-6 mt-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-gray-300">In Stock</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-gray-300">Featured Product</span>
              </label>
            </div>
          </div>

          {/* Images */}
          <div className="glass-card-admin p-6">
            <h2 className="text-xl font-bold text-white mb-6">Product Images</h2>
            
            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="mb-4">
                <h3 className="text-base font-medium text-gray-300 mb-2">Current Images</h3>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                  {existingImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Current ${index + 1}`}
                        className="w-full aspect-square object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Add New Images (Max 5 total)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-lg text-sm text-white file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
              />
            </div>

            {imagePreviews.length > 0 && (
              <div>
                <h3 className="text-base font-medium text-gray-300 mb-2">New Images</h3>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`New ${index + 1}`}
                        className="w-full aspect-square object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sizes and Colors */}
          <div className="glass-card-admin p-6">
            <h2 className="text-xl font-bold text-white mb-6">Variants</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sizes
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                    placeholder="e.g., S, M, L, XL"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
                  />
                  <button
                    type="button"
                    onClick={addSize}
                    className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.sizes.map(size => (
                    <span
                      key={size}
                      className="bg-white/10 px-3 py-1 rounded-full text-sm text-gray-300 flex items-center gap-2"
                    >
                      {size}
                      <button
                        type="button"
                        onClick={() => removeSize(size)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Colors
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                    placeholder="e.g., Red, Blue, Black"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
                  />
                  <button
                    type="button"
                    onClick={addColor}
                    className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.colors.map(color => (
                    <span
                      key={color}
                      className="bg-white/10 px-3 py-1 rounded-full text-sm text-gray-300 flex items-center gap-2"
                    >
                      {color}
                      <button
                        type="button"
                        onClick={() => removeColor(color)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2.5 bg-white/10 text-gray-300 rounded-lg hover:bg-white/20 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-sm px-4 py-2.5"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                'Update Merchandise'
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}