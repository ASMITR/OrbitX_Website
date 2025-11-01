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
    <div className="min-h-screen text-white pt-16 sm:pt-20 px-4 sm:px-6 lg:px-8">
      <section className="text-center mb-8 sm:mb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            OrbitX Merchandise
          </h1>
          <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-300 mb-6 sm:mb-8 leading-relaxed">
            Show your space exploration spirit with our exclusive merchandise collection
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <CartIcon />
            <button
              onClick={() => router.push('/my-orders')}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 border border-green-400/30 text-green-400 hover:text-green-300 rounded-lg transition-all duration-300 flex items-center gap-2 text-sm sm:text-base"
            >
              <Package className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Track Orders</span>
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search merchandise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-3 bg-white/10 border border-white/20 rounded-lg text-sm text-white focus:outline-none focus:border-green-400 sm:w-40"
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
            className="px-3 py-3 bg-white/10 border border-white/20 rounded-lg text-sm text-white focus:outline-none focus:border-green-400 sm:w-44"
          >
            <option value="newest" className="bg-black">Newest First</option>
            <option value="price-low" className="bg-black">Price: Low to High</option>
            <option value="price-high" className="bg-black">Price: High to Low</option>
            <option value="name" className="bg-black">Name A-Z</option>
          </select>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pb-12 sm:pb-16">
        {filteredMerchandise.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400 mb-2">No merchandise found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredMerchandise.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group glass-card hover:border-green-400/50 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300 flex flex-col overflow-hidden"
              >
                {/* Product Image */}
                <div className="relative h-48 flex-shrink-0 overflow-hidden bg-white/5">
                  <img
                    src={item.coverImage || (item.images && item.images[0]) || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=1f2937&color=ffffff&size=400`}
                    alt={item.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=1f2937&color=ffffff&size=400`
                    }}
                  />
                  
                  {/* Status Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {item.featured && (
                      <span className="bg-yellow-500/30 text-yellow-200 px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border border-yellow-400/50">
                        ⭐ Featured
                      </span>
                    )}
                    {!item.inStock && (
                      <span className="bg-red-500/30 text-red-200 px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border border-red-400/50">
                        Out of Stock
                      </span>
                    )}
                  </div>
                  
                  {/* Price Badge */}
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-lg p-2 border border-white/20">
                    <span className="text-green-400 font-bold text-sm">₹{item.price}</span>
                  </div>
                  
                  {/* Wishlist Button */}
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="p-2 bg-black/60 hover:bg-black/80 text-white rounded-full backdrop-blur-sm transition-colors">
                      <Heart className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Product Content */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-white text-lg mb-2 line-clamp-2 group-hover:text-green-300 transition-colors">
                    {item.name}
                  </h3>
                  
                  <p className="text-sm text-gray-300 mb-4 line-clamp-2 leading-relaxed flex-1">
                    {item.description}
                  </p>

                  {/* Product Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-400 text-sm">
                      <Package className="h-4 w-4 mr-2 text-green-400 flex-shrink-0" />
                      <span className="truncate">{item.category}</span>
                    </div>
                    
                    {/* Sizes */}
                    {item.sizes && item.sizes.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">Sizes:</span>
                        <div className="flex gap-1">
                          {item.sizes.slice(0, 3).map(size => (
                            <span key={size} className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded border border-green-500/30">
                              {size}
                            </span>
                          ))}
                          {item.sizes.length > 3 && (
                            <span className="text-xs text-gray-400">+{item.sizes.length - 3}</span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Colors */}
                    {item.colors && item.colors.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">Colors:</span>
                        <div className="flex gap-1">
                          {item.colors.slice(0, 4).map(color => (
                            <div
                              key={color}
                              className="w-4 h-4 rounded-full border-2 border-white/30 shadow-sm"
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

                  {/* Bottom Section */}
                  <div className="mt-auto space-y-3">
                    {/* View Details Button */}
                    <Link href={`/merchandise/${item.id}`} className="block">
                      <button className="w-full py-2 px-4 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg font-semibold text-sm border border-green-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25">
                        View Details
                        <ShoppingCart className="inline ml-2 h-4 w-4" />
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}