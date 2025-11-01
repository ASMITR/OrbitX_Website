'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, ShoppingCart, Plus, Minus, Heart, Package } from 'lucide-react'
import { Merchandise } from '@/lib/types'
import { useCart } from '@/contexts/CartContext'
import toast from 'react-hot-toast'
import CartIcon from '@/components/CartIcon'

export default function MerchandiseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [merchandise, setMerchandise] = useState<Merchandise | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [addingToCart, setAddingToCart] = useState(false)
  const { addToCart } = useCart()

  useEffect(() => {
    if (params.id) {
      fetchMerchandise(params.id as string)
    }
  }, [params.id])

  const fetchMerchandise = async (id: string) => {
    try {
      const response = await fetch(`/api/merchandise/${id}`, {
        next: { revalidate: 300 }
      })
      if (response.ok) {
        const data = await response.json()
        setMerchandise(data)
        if (data.sizes?.length > 0) setSelectedSize(data.sizes[0])
        if (data.colors?.length > 0) setSelectedColor(data.colors[0])
      } else {
        toast.error('Product not found')
        router.push('/merchandise')
      }
    } catch (error) {
      console.error('Error fetching merchandise:', error)
      toast.error('Failed to load product')
      router.push('/merchandise')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!merchandise) return
    
    if (merchandise.sizes && merchandise.sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size')
      return
    }
    
    if (merchandise.colors && merchandise.colors.length > 0 && !selectedColor) {
      toast.error('Please select a color')
      return
    }

    setAddingToCart(true)
    
    try {
      const cartItem = {
        merchandiseId: merchandise.id,
        name: merchandise.name,
        price: merchandise.price,
        image: merchandise.coverImage || merchandise.images[0],
        size: selectedSize,
        color: selectedColor,
        quantity
      }

      addToCart(cartItem)
      toast.success('Added to cart!')
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Failed to add to cart')
    } finally {
      setAddingToCart(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
      </div>
    )
  }

  if (!merchandise) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-400 mb-2">Product not found</h3>
          <button onClick={() => router.push('/merchandise')} className="btn-primary">
            Back to Merchandise
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white pt-16 sm:pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-3 sm:gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-400 hover:text-white transition-all duration-300 hover:scale-105 group"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium text-sm sm:text-base">Back to Merchandise</span>
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/my-orders')}
              className="group px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 border border-green-400/30 text-green-400 hover:text-green-300 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 flex items-center gap-2 text-sm sm:text-base"
            >
              <Package className="h-4 w-4 group-hover:rotate-12 transition-transform" />
              <span>Track Orders</span>
            </button>
            <CartIcon />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Enhanced Images Section */}
          <div className="space-y-4 sm:space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 shadow-2xl group"
            >
              <img
                src={merchandise.images[selectedImage] || `https://ui-avatars.com/api/?name=${encodeURIComponent(merchandise.name)}&background=1f2937&color=ffffff&size=500`}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(merchandise.name)}&background=1f2937&color=ffffff&size=500`
                }}
                alt={merchandise.name}
                className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
              />
              {merchandise.featured && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
                  ⭐ Featured
                </div>
              )}
              {!merchandise.inStock && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                  <span className="text-white font-bold text-xl bg-red-500/90 px-6 py-3 rounded-xl">Out of Stock</span>
                </div>
              )}
            </motion.div>
            {merchandise.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {merchandise.images.map((image, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
                      selectedImage === index 
                        ? 'border-blue-400 shadow-lg shadow-blue-400/25' 
                        : 'border-white/20 hover:border-white/40'
                    }`}
                  >
                    <img 
                      src={image || `https://ui-avatars.com/api/?name=${encodeURIComponent(merchandise.name)}&background=1f2937&color=ffffff&size=80`} 
                      alt={`${merchandise.name} ${index + 1}`} 
                      className="w-full h-full object-contain p-1"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(merchandise.name)}&background=1f2937&color=ffffff&size=80`
                      }}
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Enhanced Product Details */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4 sm:space-y-6 lg:space-y-8"
          >
            <div className="glass-card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 leading-tight">{merchandise.name}</h1>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm text-gray-400 bg-white/10 px-3 py-1 rounded-full">{merchandise.category}</span>
                    {merchandise.stockQuantity !== undefined && (
                      <span className="text-sm text-gray-400">{merchandise.stockQuantity} units available</span>
                    )}
                  </div>
                </div>
                <button className="text-gray-400 hover:text-red-400 transition-all duration-300 hover:scale-110 p-2">
                  <Heart className="h-6 w-6" />
                </button>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  ₹{merchandise.price}
                </span>
                <span className={`px-4 py-2 rounded-full font-bold border ${
                  merchandise.inStock 
                    ? 'bg-green-500/20 text-green-400 border-green-400/30' 
                    : 'bg-red-500/20 text-red-400 border-red-400/30'
                }`}>
                  {merchandise.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                </span>
              </div>
              
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed text-lg">{merchandise.description}</p>
              </div>
            </div>

            {/* Size Selection */}
            {merchandise.sizes && merchandise.sizes.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {merchandise.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        selectedSize === size
                          ? 'border-blue-400 bg-blue-400/20 text-blue-400'
                          : 'border-white/20 bg-white/5 text-gray-300 hover:border-white/40'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {merchandise.colors && merchandise.colors.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {merchandise.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        selectedColor === color
                          ? 'border-blue-400 bg-blue-400/20 text-blue-400'
                          : 'border-white/20 bg-white/5 text-gray-300 hover:border-white/40'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full border border-white/20"
                          style={{ backgroundColor: color.toLowerCase() }}
                        />
                        {color}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Quantity</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Total Price */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex justify-between items-center">
                <span className="text-lg text-gray-300">Total:</span>
                <span className="text-2xl font-bold text-blue-400">₹{merchandise.price * quantity}</span>
              </div>
            </div>

            {/* Enhanced Add to Cart Button */}
            <motion.button
              whileHover={{ scale: merchandise.inStock && !addingToCart ? 1.02 : 1 }}
              whileTap={{ scale: merchandise.inStock && !addingToCart ? 0.98 : 1 }}
              onClick={handleAddToCart}
              disabled={!merchandise.inStock || addingToCart}
              className={`w-full py-5 rounded-2xl font-bold text-xl transition-all duration-300 flex items-center justify-center gap-4 shadow-lg ${
                merchandise.inStock && !addingToCart
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white hover:shadow-xl hover:shadow-blue-500/25'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              {addingToCart ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  <span>Adding to Cart...</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="h-6 w-6" />
                  <span>{merchandise.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
                </>
              )}
            </motion.button>

          </motion.div>
        </div>
      </div>
    </div>
  )
}