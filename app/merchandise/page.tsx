'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, ShoppingCart, Heart, Package } from 'lucide-react'
import { Merchandise } from '@/lib/types'
import toast from 'react-hot-toast'
import CartIcon from '@/components/CartIcon'

export default function MerchandisePage() {
  const router = useRouter()
  const [merchandise, setMerchandise] = useState<Merchandise[]>([])
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
      }
    } catch (error) {
      console.error('Error fetching merchandise:', error)
      toast.error('Failed to load merchandise')
    } finally {
      setLoading(false)
    }
  }

  const filteredMerchandise = useMemo(() => {
    let filtered = merchandise.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }

    return filtered.sort((a, b) => {
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
        className="section-spacing-sm text-center"
      >
        <div className="container-responsive max-w-4xl mx-auto">
          <h1 className="text-responsive-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            OrbitX Merchandise
          </h1>
          <p className="text-responsive-lg text-gray-300 mb-8">
            Show your space exploration spirit with our exclusive merchandise collection
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
            <CartIcon />
            <button
              onClick={() => router.push('/my-orders')}
              className="btn-primary bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 border border-green-400/30 text-green-400 hover:text-green-300 flex items-center gap-2"
            >
              <Package className="h-4 w-4" />
              <span>Track Orders</span>
            </button>
          </div>
        </div>
      </motion.section>

      <div className="container-responsive max-w-6xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
          <div className="relative flex-1 max-w-full sm:max-w-sm">
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

      <div className="container-responsive max-w-7xl mx-auto pb-16">
        {filteredMerchandise.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400 mb-2">No merchandise found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {filteredMerchandise.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden hover:border-blue-400/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 w-full max-w-md mx-auto"
              >
                <div className="relative aspect-square overflow-hidden bg-white/5">
                  <img
                    src={item.coverImage || (item.images && item.images[0]) || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=1f2937&color=ffffff&size=400`}
                    alt={item.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 p-2"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=1f2937&color=ffffff&size=400`
                    }}
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="absolute top-2 left-2 flex gap-2">
                    {item.featured && (
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                        ⭐ Featured
                      </div>
                    )}
                    {!item.inStock && (
                      <div className="bg-red-500/90 text-white px-2 py-1 rounded-full text-xs font-bold">
                        Out of Stock
                      </div>
                    )}
                  </div>
                  
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-colors">
                      <Heart className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <div className="mb-2">
                    <h3 className="font-semibold text-white text-sm line-clamp-1 group-hover:text-blue-400 transition-colors">
                      {item.name}
                    </h3>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-lg font-bold text-blue-400">₹{item.price}</span>
                      <span className="text-xs text-gray-400 bg-white/10 px-2 py-1 rounded-full">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-300 mb-3 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  {(item.sizes || item.colors) && (
                    <div className="mb-3 space-y-1">
                      {item.sizes && (
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-400">Sizes:</span>
                          <div className="flex gap-1">
                            {item.sizes.slice(0, 3).map(size => (
                              <span key={size} className="text-xs bg-white/10 px-1.5 py-0.5 rounded text-gray-300">
                                {size}
                              </span>
                            ))}
                            {item.sizes.length > 3 && (
                              <span className="text-xs text-gray-400">+{item.sizes.length - 3}</span>
                            )}
                          </div>
                        </div>
                      )}
                      {item.colors && (
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-400">Colors:</span>
                          <div className="flex gap-1">
                            {item.colors.slice(0, 4).map(color => (
                              <div
                                key={color}
                                className="w-3 h-3 rounded-full border border-white/30 shadow-sm"
                                style={{ backgroundColor: color.toLowerCase() }}
                                title={color}
                              />
                            ))}
                            {item.colors.length > 4 && (
                              <span className="text-xs text-gray-400">+{item.colors.length - 4}</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <Link href={`/merchandise/${item.id}`} className="block">
                    <button className="w-full py-2 px-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 transform hover:-translate-y-0.5">
                      View Details
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}