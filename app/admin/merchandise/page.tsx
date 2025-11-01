'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Plus, Search, Edit, Trash2, Eye, Package } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Merchandise } from '@/lib/types'
import toast from 'react-hot-toast'

export default function AdminMerchandisePage() {
  const [merchandise, setMerchandise] = useState<Merchandise[]>([])
  const [filteredMerchandise, setFilteredMerchandise] = useState<Merchandise[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchMerchandise()
  }, [])

  const fetchMerchandise = async () => {
    try {
      const response = await fetch('/api/merchandise')
      if (response.ok) {
        const data = await response.json()
        setMerchandise(data)
        setFilteredMerchandise(data)
      }
    } catch (error) {
      console.error('Error fetching merchandise:', error)
      toast.error('Failed to load merchandise')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let filtered = merchandise.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }

    setFilteredMerchandise(filtered)
  }, [merchandise, searchTerm, selectedCategory])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this merchandise item?')) return

    setDeleteLoading(id)
    try {
      const response = await fetch(`/api/merchandise/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setMerchandise(prev => prev.filter(item => item.id !== id))
        toast.success('Merchandise deleted successfully')
      } else {
        toast.error('Failed to delete merchandise')
      }
    } catch (error) {
      console.error('Error deleting merchandise:', error)
      toast.error('Failed to delete merchandise')
    } finally {
      setDeleteLoading(null)
    }
  }

  const categories = ['all', ...Array.from(new Set(merchandise.map(item => item.category)))]

  if (loading) {
    return (
      <AdminLayout title="Merchandise Management">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Merchandise Management">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-xl font-bold text-white">Merchandise Management</h1>
            <p className="text-sm text-gray-400">Manage your organization's merchandise catalog</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/orders">
              <button className="btn-secondary flex items-center text-sm px-4 py-2">
                View Orders
              </button>
            </Link>
            <Link href="/admin/merchandise/new">
              <button className="btn-primary flex items-center text-sm px-4 py-2">
                <Plus className="h-4 w-4 mr-2" />
                Add New Item
              </button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card-admin p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search merchandise..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2.5 bg-white/10 border border-white/20 rounded-lg text-sm text-white focus:outline-none focus:border-blue-400"
            >
              {categories.map(category => (
                <option key={category} value={category} className="bg-black">
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Merchandise Grid */}
        {filteredMerchandise.length === 0 ? (
          <div className="glass-card-admin p-6 text-center">
            <Package className="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-400 mb-2">No merchandise found</h3>
            <p className="text-sm text-gray-500 mb-4">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Start by adding your first merchandise item'
              }
            </p>
            {!searchTerm && selectedCategory === 'all' && (
              <Link href="/admin/merchandise/new">
                <button className="btn-primary text-sm px-6 py-2.5 whitespace-nowrap">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Item
                </button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredMerchandise.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card-admin hover:border-green-400/50 transition-all duration-300 group flex flex-col overflow-hidden"
              >
                {/* Image */}
                <div className="relative h-48 flex-shrink-0 overflow-hidden bg-white/5">
                  <img
                    src={item.coverImage || (item.images && item.images[0]) || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=1f2937&color=ffffff&size=400`}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=1f2937&color=ffffff&size=400`
                    }}
                    alt={item.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Status Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {item.featured && (
                      <span className="bg-yellow-500/30 text-yellow-200 px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border border-yellow-400/50">
                        ⭐ Featured
                      </span>
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
                      item.inStock 
                        ? 'bg-green-500/30 text-green-200 border border-green-400/50' 
                        : 'bg-red-500/30 text-red-200 border border-red-400/50'
                    }`}>
                      {item.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                  
                  {/* Price Badge */}
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-lg p-2 border border-white/20">
                    <span className="text-green-400 font-bold text-sm">₹{item.price}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 group-hover:text-green-300 transition-colors">
                    {item.name}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed flex-1">
                    {item.description}
                  </p>

                  {/* Product Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-400 text-sm">
                      <Package className="h-4 w-4 mr-2 text-green-400 flex-shrink-0" />
                      <span className="truncate">{item.category}</span>
                    </div>
                    {item.stockQuantity !== undefined && (
                      <div className="flex items-center text-gray-400 text-sm">
                        <span className="w-4 h-4 mr-2 text-blue-400 flex-shrink-0 text-center">#</span>
                        <span>Stock: {item.stockQuantity}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
                    <div className="flex items-center space-x-2">
                      <motion.button
                        onClick={() => window.open(`/merchandise/${item.id}`, '_blank')}
                        className="p-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Eye className="h-4 w-4" />
                      </motion.button>
                      <Link href={`/admin/merchandise/${item.id}/edit`}>
                        <motion.button
                          className="p-2 bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 rounded-lg transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Edit className="h-4 w-4" />
                        </motion.button>
                      </Link>
                      <motion.button
                        onClick={() => handleDelete(item.id)}
                        disabled={deleteLoading === item.id}
                        className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors disabled:opacity-50"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {deleteLoading === item.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-400"></div>
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </motion.button>
                    </div>
                    
                    {/* Sales indicator */}
                    <div className="text-xs text-gray-500">
                      ID: {item.id.slice(-6)}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}