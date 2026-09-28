'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Plus, Minus, Trash2, Gift, Truck, Heart, Share2, Star, Clock, Shield, Zap, Users, Award } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function CartPage() {
  const router = useRouter()
  const [promoInput, setPromoInput] = useState('')
  const [timeLeft, setTimeLeft] = useState(15 * 60)
  
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    getTotalItems, 
    getTotalPrice,
    getSubtotal,
    getTotalDiscount,
    getShippingCost,
    applyPromoCode,
    removePromoCode,
    promoCode,
    promoDiscount,
    recentlyRemoved,
    restoreItem
  } = useCart()

  useEffect(() => {
    if (items.length > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev > 0 ? prev - 1 : 0)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [items.length])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleApplyPromo = () => {
    if (applyPromoCode(promoInput)) {
      toast.success(`🎉 Promo code applied! ${promoDiscount}% off`)
      setPromoInput('')
    } else {
      toast.error('❌ Invalid promo code')
    }
  }

  const handleSaveForLater = (itemId: string) => {
    removeFromCart(itemId)
    toast.success('💝 Item saved for later')
  }

  const calculateSavings = () => {
    return items.reduce((total, item) => {
      const originalPrice = item.originalPrice || item.price
      return total + ((originalPrice - item.price) * item.quantity)
    }, 0) + getTotalDiscount()
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-20 px-3 sm:px-4 lg:px-6 xl:px-8 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4 sm:gap-0">
          <motion.button
            onClick={() => router.back()}
            className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
            whileHover={{ x: -5 }}
          >
            <ArrowLeft className="h-4 sm:h-5 w-4 sm:w-5 mr-2" />
            <span className="text-sm sm:text-base">Continue Shopping</span>
          </motion.button>
          
          {items.length > 0 && timeLeft > 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 px-3 sm:px-4 py-2 rounded-full"
            >
              <Clock className="h-3 sm:h-4 w-3 sm:w-4 text-orange-400" />
              <span className="text-orange-300 text-xs sm:text-sm font-medium">
                Reserved for {formatTime(timeLeft)}
              </span>
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          <div className="xl:col-span-2">
            <div className="bg-black/50 backdrop-blur-md border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full"></div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Shopping Cart ({getTotalItems()} items)
                </h1>
                {calculateSavings() > 0 && (
                  <div className="flex items-center gap-2 bg-green-500/20 border border-green-500/30 px-2 sm:px-3 py-1 rounded-full">
                    <Award className="h-3 sm:h-4 w-3 sm:w-4 text-green-400" />
                    <span className="text-green-300 text-xs sm:text-sm font-medium">
                      You're saving ₹{calculateSavings()}
                    </span>
                  </div>
                )}
              </div>

              <AnimatePresence>
                {recentlyRemoved && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0"
                  >
                    <span className="text-orange-300 text-sm sm:text-base">
                      {recentlyRemoved.name} was removed
                    </span>
                    <button
                      onClick={() => {
                        restoreItem()
                        toast.success('Item restored!')
                      }}
                      className="text-orange-400 hover:text-orange-300 font-medium text-sm sm:text-base"
                    >
                      Undo
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {items.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12 sm:py-16"
                >
                  <motion.div 
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-6xl sm:text-8xl mb-4 sm:mb-6"
                  >
                    🛒
                  </motion.div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">Your cart is empty</h2>
                  <p className="text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base">Discover amazing products and start your space journey!</p>
                  <Link href="/merchandise">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold text-base sm:text-lg shadow-lg shadow-blue-500/25"
                    >
                      🚀 Explore Products
                    </motion.button>
                  </Link>
                </motion.div>
              ) : (
                <div className="space-y-4 sm:space-y-6">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
                    >
                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                        <div className="relative">
                          <motion.img
                            whileHover={{ scale: 1.05 }}
                            src={item.image}
                            alt={item.name}
                            className="w-full sm:w-24 md:w-32 h-32 sm:h-24 md:h-32 object-cover rounded-xl shadow-lg mx-auto sm:mx-0"
                          />
                          {item.discount && (
                            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                              -{item.discount}%
                            </div>
                          )}
                          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-white text-xs font-medium">4.8</span>
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-3 sm:gap-0">
                            <div>
                              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-2 group-hover:from-blue-300 group-hover:to-purple-300 transition-all text-center sm:text-left">{item.name}</h3>
                              {item.category && (
                                <p className="text-gray-400 text-sm mb-2 text-center sm:text-left">{item.category}</p>
                              )}
                              <div className="flex flex-wrap gap-2 sm:gap-3 mt-3 justify-center sm:justify-start">
                                {item.size && (
                                  <span className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-blue-300 px-3 py-1.5 rounded-full text-sm font-semibold">
                                    Size: {item.size}
                                  </span>
                                )}
                                {item.color && (
                                  <span className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300 px-3 py-1.5 rounded-full text-sm font-semibold">
                                    {item.color}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2 justify-center sm:justify-start">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleSaveForLater(item.id)}
                                className="text-gray-400 hover:text-pink-400 p-2 rounded-full hover:bg-pink-500/10 transition-all"
                              >
                                <Heart className="h-4 sm:h-5 w-4 sm:w-5" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => removeFromCart(item.id)}
                                className="text-gray-400 hover:text-red-400 p-2 rounded-full hover:bg-red-500/10 transition-all"
                              >
                                <Trash2 className="h-4 sm:h-5 w-4 sm:w-5" />
                              </motion.button>
                            </div>
                          </div>

                          <div className="flex flex-col lg:flex-row items-center justify-between mt-6 gap-4 lg:gap-0">
                            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full lg:w-auto">
                              <div className="flex items-center bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-1.5 sm:p-2 border border-gray-600/50">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-r from-red-500/30 to-pink-500/30 hover:from-red-500/50 hover:to-pink-500/50 flex items-center justify-center text-white border border-red-500/40 transition-all shadow-lg"
                                >
                                  <Minus className="h-4 sm:h-5 w-4 sm:w-5" />
                                </motion.button>
                                <span className="text-white font-black text-lg sm:text-xl w-16 sm:w-20 text-center">
                                  {item.quantity}
                                </span>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-r from-green-500/30 to-emerald-500/30 hover:from-green-500/50 hover:to-emerald-500/50 flex items-center justify-center text-white border border-green-500/40 transition-all shadow-lg"
                                >
                                  <Plus className="h-4 sm:h-5 w-4 sm:w-5" />
                                </motion.button>
                              </div>
                              {item.stock && item.stock <= 5 && (
                                <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/40 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl">
                                  <Zap className="h-3 sm:h-4 w-3 sm:w-4 text-orange-400" />
                                  <span className="text-orange-300 text-xs sm:text-sm font-bold">Only {item.stock} left!</span>
                                </div>
                              )}
                            </div>

                            <div className="text-center lg:text-right w-full lg:w-auto">
                              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mb-1">
                                <span className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                  ₹{item.price * item.quantity}
                                </span>
                                {item.originalPrice && item.originalPrice > item.price && (
                                  <span className="text-gray-500 text-lg sm:text-xl line-through">
                                    ₹{item.originalPrice * item.quantity}
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-400 text-sm font-medium">₹{item.price} each</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {items.length > 0 && (
            <div className="xl:col-span-1">
              <div className="bg-black/50 backdrop-blur-md border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 sticky top-20 sm:top-24 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                
                <div className="flex items-center gap-2 mb-4 sm:mb-6">
                  <Shield className="h-5 sm:h-6 w-5 sm:w-6 text-green-400" />
                  <h2 className="text-lg sm:text-xl font-bold text-white">Secure Checkout</h2>
                </div>

                <div className="mb-4 sm:mb-6">
                  {!promoCode ? (
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                          placeholder="Enter promo code"
                          className="w-full sm:flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:outline-none text-sm"
                        />
                        <button
                          onClick={handleApplyPromo}
                          className="w-full sm:w-auto px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-sm"
                        >
                          Apply
                        </button>
                      </div>
                      <div className="text-xs sm:text-sm text-gray-400 text-center sm:text-left">
                        Try: ORBITX10, SPACE20, WELCOME15, STUDENT25
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-green-500/20 border border-green-500/30 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Gift className="h-4 w-4 text-green-400" />
                        <span className="text-green-300 font-medium text-sm sm:text-base">
                          {promoCode} (-{promoDiscount}%)
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          removePromoCode()
                          toast.success('Promo code removed')
                        }}
                        className="text-green-400 hover:text-green-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  <div className="bg-gray-800/30 rounded-lg sm:rounded-xl p-3 sm:p-4 space-y-2 sm:space-y-3">
                    <div className="flex justify-between text-gray-300 text-sm sm:text-base">
                      <span>Subtotal ({getTotalItems()} items)</span>
                      <span className="font-medium text-sm sm:text-base">₹{getSubtotal()}</span>
                    </div>
                    
                    {getTotalDiscount() > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex justify-between text-green-400 text-sm sm:text-base"
                      >
                        <div className="flex items-center gap-1">
                          <Gift className="h-4 w-4" />
                          <span>Total Savings</span>
                        </div>
                        <span className="font-bold">-₹{getTotalDiscount()}</span>
                      </motion.div>
                    )}
                    
                    <div className="flex justify-between text-gray-300 text-sm sm:text-base">
                      <div className="flex items-center gap-1">
                        <Truck className="h-4 w-4" />
                        <span>Shipping</span>
                      </div>
                      <span className={`font-medium text-sm sm:text-base ${getShippingCost() === 0 ? 'text-green-400' : ''}`}>
                        {getShippingCost() === 0 ? 'FREE' : `₹${getShippingCost()}`}
                      </span>
                    </div>
                    
                    {getShippingCost() > 0 && (
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                        <p className="text-blue-300 text-xs sm:text-sm text-center">
                          Add ₹{500 - getSubtotal()} more for FREE shipping! 🚚
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg sm:rounded-xl p-3 sm:p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-bold text-lg sm:text-xl">Total</span>
                      <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        ₹{getTotalPrice()}
                      </span>
                    </div>
                    {calculateSavings() > 0 && (
                      <p className="text-green-400 text-xs sm:text-sm mt-1 text-center">
                        🎉 You saved ₹{calculateSavings()} on this order!
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <Link href="/checkout">
                    <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-lg font-semibold text-sm shadow-lg transition-all">
                      🚀 Secure Checkout
                    </button>
                  </Link>
                  
                  <div className="border-t border-gray-700/50 pt-4">
                    <Link href="/merchandise">
                      <button className="w-full border border-gray-600 hover:border-blue-400 text-gray-300 hover:text-white py-2.5 rounded-lg font-medium text-sm transition-all hover:bg-blue-500/10">
                        Continue Shopping
                      </button>
                    </Link>
                  </div>
                  
                  <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-700">
                    <div className="flex items-center gap-1 text-gray-400 text-xs">
                      <Shield className="h-3 w-3" />
                      <span>SSL Secured</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400 text-xs">
                      <Truck className="h-3 w-3" />
                      <span>Fast Delivery</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400 text-xs">
                      <Award className="h-3 w-3" />
                      <span>Best Price</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}