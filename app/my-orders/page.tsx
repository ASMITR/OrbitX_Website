'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Package, Search, Eye, ArrowLeft } from 'lucide-react'
import { Order } from '@/lib/types'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function MyOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    const savedEmail = localStorage.getItem('customerEmail')
    if (savedEmail) {
      setEmail(savedEmail)
      fetchOrders(savedEmail)
    } else {
      setLoading(false)
    }
  }, [])

  const fetchOrders = async (customerEmail: string) => {
    try {
      const response = await fetch(`/api/orders?email=${encodeURIComponent(customerEmail)}`, {
        next: { revalidate: 30 }
      })
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
        setFilteredOrders(data)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      toast.error('Please enter your email')
      return
    }
    localStorage.setItem('customerEmail', email)
    setLoading(true)
    fetchOrders(email)
  }

  useEffect(() => {
    const filtered = orders.filter(order => 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredOrders(filtered)
  }, [orders, searchTerm])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white pt-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
      </div>
    )
  }

  if (!email || orders.length === 0) {
    return (
      <div className="min-h-screen text-white pt-16">
        <div className="max-w-md mx-auto px-4 py-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
          
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Track Your Orders</h2>
            <p className="text-gray-300 mb-6">Enter your email to view your order history</p>
            
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                placeholder="Enter your email address"
                required
              />
              <button
                type="submit"
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
              >
                View My Orders
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white pt-16">
      <div className="container-responsive max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-400 hover:text-white transition-colors hover:scale-105"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span className="font-medium">Back</span>
          </button>
          <button
            onClick={() => {
              localStorage.removeItem('customerEmail')
              setEmail('')
              setOrders([])
            }}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
          >
            Change Email
          </button>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-responsive-4xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">My Orders</h1>
          <p className="text-responsive-lg text-gray-300">Track your order status and history</p>
        </div>

        <div className="glass-card mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by order number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
            />
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="glass-card text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-responsive-xl font-bold text-gray-400 mb-4">No orders found</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              {searchTerm ? 'Try adjusting your search terms' : 'You haven\'t placed any orders yet. Start shopping to see your orders here!'}
            </p>
            <button
              onClick={() => router.push('/merchandise')}
              className="btn-primary px-8 py-3 text-lg"
            >
              Browse Merchandise
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:border-blue-400/30 transition-all duration-300 group"
              >
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                      <div className="mb-4 sm:mb-0">
                        <h3 className="text-white font-bold text-xl mb-2">{order.orderNumber}</h3>
                        <p className="text-gray-400">Ordered on {new Date(order.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-blue-400 font-bold text-2xl mb-2">₹{order.total}</p>
                        <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
                          order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/30' :
                          order.status === 'confirmed' ? 'bg-blue-500/20 text-blue-400 border border-blue-400/30' :
                          order.status === 'shipped' ? 'bg-purple-500/20 text-purple-400 border border-purple-400/30' :
                          order.status === 'delivered' ? 'bg-green-500/20 text-green-400 border border-green-400/30' :
                          'bg-red-500/20 text-red-400 border border-red-400/30'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="group relative bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md rounded-xl p-4 hover:from-white/15 hover:to-white/10 transition-all duration-300 border border-white/10 hover:border-blue-400/30 hover:shadow-lg hover:shadow-blue-500/10">
                          <div className="flex items-center gap-4">
                            <div className="relative flex-shrink-0">
                              <div className="w-20 h-20 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-1 shadow-lg">
                                <img 
                                  src={item.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=1f2937&color=ffffff&size=80`}
                                  alt={item.name} 
                                  className="w-full h-full object-contain rounded" 
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement
                                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=1f2937&color=ffffff&size=80`
                                  }}
                                />
                              </div>
                              <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                                {item.quantity}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-white font-semibold text-sm mb-2 line-clamp-1 group-hover:text-blue-400 transition-colors">{item.name}</h4>
                              
                              <div className="flex items-center gap-3 mb-2">
                                {item.size && (
                                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-500/20 text-blue-300">
                                    📏 {item.size}
                                  </span>
                                )}
                                {item.color && (
                                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-500/20 text-purple-300">
                                    🎨 {item.color}
                                  </span>
                                )}
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <span className="text-gray-400 text-sm">₹{item.price} × {item.quantity}</span>
                                <span className="text-blue-400 font-bold">₹{item.price * item.quantity}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-white/20 gap-3">
                      <div className="flex items-center gap-4">
                        <span className="text-gray-400">
                          {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-400">Order ID: {order.id.slice(-8)}</span>
                      </div>
                      <button
                        onClick={() => router.push(`/order-confirmation/${order.id}`)}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 text-blue-300 hover:text-blue-200 rounded-lg font-medium transition-all duration-300 hover:scale-105 border border-blue-400/20"
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </button>
                    </div>
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