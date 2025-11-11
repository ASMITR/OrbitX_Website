'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Package, Search, Eye, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { collection, query, orderBy, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface Order {
  id: string
  orderId: string
  total: number
  status: string
  createdAt: any
  items: any[]
}

export default function MyOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersQuery = query(
          collection(db, 'orders'),
          orderBy('createdAt', 'desc')
        )
        const snapshot = await getDocs(ordersQuery)
        const ordersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Order[]
        setOrders(ordersData)
        setFilteredOrders(ordersData)
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  useEffect(() => {
    const filtered = orders.filter(order => 
      order.orderId?.toLowerCase().includes(searchTerm.toLowerCase())
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



  return (
    <div className="min-h-screen text-white pt-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-400 hover:text-white transition-colors hover:scale-105"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span className="font-medium">Back</span>
          </button>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">My Orders</h1>
          <p className="text-lg text-gray-300">Track your order status and history</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-8"
        >
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-all duration-300"
            />
          </div>
        </motion.div>

        {filteredOrders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl text-center py-12"
          >
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">No orders found</h3>
            <p className="text-gray-300 mb-8 max-w-md mx-auto">
              {searchTerm ? 'Try adjusting your search terms' : 'You haven\'t placed any orders yet. Start shopping to see your orders here!'}
            </p>
            <motion.button
              onClick={() => router.push('/merchandise')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            >
              Browse Merchandise
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl hover:border-blue-400/40 transition-all duration-300 group flex flex-col overflow-hidden shadow-xl hover:shadow-2xl"
              >
                {/* Order Header */}
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-bold text-xl mb-2 group-hover:text-blue-300 transition-colors">
                        Order #{order.orderId}
                      </h3>
                      <p className="text-gray-400 text-sm flex items-center">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                        {order.createdAt?.toDate?.()?.toLocaleDateString('en-US', { 
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        }) || 'Recent'}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-2">₹{order.total}</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border ${
                        order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30' :
                        order.status === 'confirmed' ? 'bg-blue-500/20 text-blue-300 border-blue-400/30' :
                        order.status === 'shipped' ? 'bg-purple-500/20 text-purple-300 border-purple-400/30' :
                        order.status === 'delivered' ? 'bg-green-500/20 text-green-300 border-green-400/30' :
                        'bg-red-500/20 text-red-300 border-red-400/30'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6 flex-1">
                  <div className="space-y-4 mb-4">
                    {order.items?.slice(0, 3).map((item, idx) => (
                      <motion.div 
                        key={idx} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center gap-4 bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 border border-white/5 hover:border-white/20"
                      >
                        <div className="relative flex-shrink-0">
                          <img 
                            src={item.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=1f2937&color=ffffff&size=60`}
                            alt={item.name} 
                            className="w-14 h-14 object-cover rounded-xl border border-white/10" 
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=1f2937&color=ffffff&size=60`
                            }}
                          />
                          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-black">
                            {item.quantity}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-semibold text-sm mb-2 group-hover:text-blue-300 transition-colors">
                            {item.name}
                          </h4>
                          
                          <div className="flex items-center gap-2 mb-2">
                            {item.size && (
                              <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-lg border border-blue-500/30">
                                {item.size}
                              </span>
                            )}
                            {item.color && (
                              <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-lg border border-purple-500/30">
                                {item.color}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-xs">₹{item.price} × {item.quantity}</span>
                            <span className="text-blue-400 font-bold text-sm">₹{item.price * item.quantity}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    
                    {(order.items?.length || 0) > 3 && (
                      <div className="text-center py-2">
                        <span className="text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-full">
                          +{(order.items?.length || 0) - 3} more items
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Footer */}
                <div className="p-6 border-t border-white/10 mt-auto">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <span className="bg-white/5 px-3 py-1 rounded-lg">{order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}</span>
                      <span>•</span>
                      <span className="font-mono">ID: {order.id.slice(-8)}</span>
                    </div>
                    
                    <motion.button
                      onClick={() => router.push(`/orders/${order.id}`)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 hover:from-blue-500/30 hover:to-purple-500/30 rounded-xl font-medium transition-all duration-300 border border-blue-500/30 text-sm"
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </motion.button>
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