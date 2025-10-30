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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredMerchandise.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-card-admin overflow-hidden group"
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={item.coverImage || (item.images && item.images[0]) || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=1f2937&color=ffffff&size=400`}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=1f2937&color=ffffff&size=400`
                    }}
                    alt={item.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 flex gap-1">
                    {item.featured && (
                      <span className="bg-yellow-500 text-black px-1.5 py-0.5 rounded-full text-xs font-bold">
                        Featured
                      </span>
                    )}
                    <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${
                      item.inStock ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                      {item.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-3">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-bold text-white line-clamp-1 flex-1 mr-2">
                      {item.name}
                    </h3>
                    <span className="text-base font-bold text-blue-400 flex-shrink-0">
                      ₹{item.price}
                    </span>
                  </div>
                  
                  <p className="text-gray-300 text-xs mb-2 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-400 bg-white/10 px-2 py-0.5 rounded-full">
                      {item.category}
                    </span>
                    {item.stockQuantity !== undefined && (
                      <span className="text-xs text-gray-400">
                        Stock: {item.stockQuantity}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                          <div className="flex gap-1">
                    <Link href={`/merchandise/${item.id}`} className="flex-1">
                      <button className="w-full py-1.5 px-2 bg-white/10 hover:bg-white/20 text-white rounded text-xs transition-colors flex items-center justify-center">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </button>
                    </Link>
                    <Link href={`/admin/merchandise/${item.id}/edit`} className="flex-1">
                      <button className="w-full py-1.5 px-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded text-xs transition-colors flex items-center justify-center">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deleteLoading === item.id}
                      className="py-1.5 px-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded text-xs transition-colors disabled:opacity-50"
                    >
                      {deleteLoading === item.id ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-300"></div>
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                    </button>
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