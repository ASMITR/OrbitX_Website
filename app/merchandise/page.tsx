'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, ShoppingCart, Heart } from 'lucide-react'
import { Merchandise } from '@/lib/types'
import toast from 'react-hot-toast'

export default function MerchandisePage() {
  const [merchandise, setMerchandise] = useState<Merchandise[]>([])
  const [filteredMerchandise, setFilteredMerchandise] = useState<Merchandise[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

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

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

    setFilteredMerchandise(filtered)
  }, [merchandise, searchTerm, selectedCategory, sortBy])

  const categories = ['all', ...Array.from(new Set(merchandise.map(item => item.category)))]

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white pt-16">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="py-12 px-4 text-center"
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            OrbitX Merchandise
          </h1>
          <p className="text-lg text-gray-300 mb-6">
            Show your space exploration spirit with our exclusive merchandise collection
          </p>
        </div>
      </motion.section>

      <div className="max-w-6xl mx-auto px-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
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

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2.5 bg-white/10 border border-white/20 rounded-lg text-sm text-white focus:outline-none focus:border-blue-400"
          >
            <option value="newest" className="bg-black">Newest First</option>
            <option value="price-low" className="bg-black">Price: Low to High</option>
            <option value="price-high" className="bg-black">Price: High to Low</option>
            <option value="name" className="bg-black">Name A-Z</option>
          </select>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-16">
        {filteredMerchandise.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-gray-400 mb-2">No merchandise found</h3>
            <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredMerchandise.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-md rounded-xl overflow-hidden border border-white/10 hover:border-blue-400/30 transition-all duration-300 group"
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={item.coverImage || item.images[0] || '/placeholder-merchandise.jpg'}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {item.featured && (
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-2 py-1 rounded-full text-xs font-bold">
                      Featured
                    </div>
                  )}
                  {!item.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">Out of Stock</span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                    <button className="text-gray-400 hover:text-red-400 transition-colors flex-shrink-0 ml-2">
                      <Heart className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <p className="text-gray-300 text-xs mb-3 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-blue-400">
                      ₹{item.price}
                    </span>
                    <span className="text-xs text-gray-400 bg-white/10 px-2 py-1 rounded-full">
                      {item.category}
                    </span>
                  </div>

                  {(item.sizes || item.colors) && (
                    <div className="mb-3 space-y-1">
                      {item.sizes && (
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-400">Sizes:</span>
                          <div className="flex gap-1 flex-wrap">
                            {item.sizes.slice(0, 4).map(size => (
                              <span key={size} className="text-xs bg-white/10 px-1.5 py-0.5 rounded">
                                {size}
                              </span>
                            ))}
                            {item.sizes.length > 4 && (
                              <span className="text-xs text-gray-400">+{item.sizes.length - 4}</span>
                            )}
                          </div>
                        </div>
                      )}
                      {item.colors && (
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-400">Colors:</span>
                          <div className="flex gap-1">
                            {item.colors.slice(0, 5).map(color => (
                              <div
                                key={color}
                                className="w-3 h-3 rounded-full border border-white/20"
                                style={{ backgroundColor: color.toLowerCase() }}
                                title={color}
                              />
                            ))}
                            {item.colors.length > 5 && (
                              <span className="text-xs text-gray-400">+{item.colors.length - 5}</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    disabled={!item.inStock}
                    className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                      item.inStock
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                    onClick={() => {
                      if (item.inStock) {
                        toast.success('Added to cart!')
                      }
                    }}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}