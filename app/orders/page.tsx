'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Package, Clock, Check, Truck, X } from 'lucide-react'
import { useAuth } from '@/components/admin/AuthProvider'
import { useRouter } from 'next/navigation'

interface Order {
  id: string
  orderNumber: string
  merchandiseId: string
  name: string
  price: number
  image: string
  size?: string
  color?: string
  quantity: number
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  customerInfo: {
    name: string
    email: string
    phone: string
    address: string
  }
  createdAt: string
}

export default function UserOrdersPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/auth')
      return
    }
    fetchUserOrders()
  }, [user, router])

  const fetchUserOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      if (response.ok) {
        const allOrders = await response.json()
        // Filter orders for current user by email
        const userOrders = allOrders.filter((order: Order) => 
          order.customerInfo?.email === user?.email
        )
        setOrders(userOrders)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400'
      case 'confirmed': return 'bg-blue-500/20 text-blue-400'
      case 'shipped': return 'bg-purple-500/20 text-purple-400'
      case 'delivered': return 'bg-green-500/20 text-green-400'
      case 'cancelled': return 'bg-red-500/20 text-red-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock
      case 'confirmed': return Check
      case 'shipped': return Truck
      case 'delivered': return Package
      case 'cancelled': return X
      default: return Clock
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white pt-16">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">My Orders</h1>
          <p className="text-gray-400">Track your merchandise orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white/5 rounded-xl p-8 text-center border border-white/10">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-400 mb-2">No orders found</h3>
            <p className="text-gray-500 mb-4">You haven't placed any orders yet</p>
            <button 
              onClick={() => router.push('/merchandise')}
              className="btn-primary"
            >
              Shop Merchandise
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => {
              const StatusIcon = getStatusIcon(order.status)
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Product Info */}
                    <div className="flex gap-4 flex-1">
                      <img
                        src={order.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(order.name)}&background=1f2937&color=ffffff&size=80`}
                        alt={order.name}
                        className="w-20 h-20 rounded-lg object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(order.name)}&background=1f2937&color=ffffff&size=80`
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-white text-lg mb-1">{order.name}</h3>
                        <p className="text-sm text-gray-400 mb-2">Order #{order.orderNumber}</p>
                        <div className="flex flex-wrap gap-2 text-sm">
                          {order.size && (
                            <span className="bg-white/10 px-2 py-1 rounded">Size: {order.size}</span>
                          )}
                          {order.color && (
                            <span className="bg-white/10 px-2 py-1 rounded">Color: {order.color}</span>
                          )}
                          <span className="bg-white/10 px-2 py-1 rounded">Qty: {order.quantity}</span>
                        </div>
                      </div>
                    </div>

                    {/* Order Status */}
                    <div className="flex flex-col items-center lg:items-end gap-3">
                      <div className="flex items-center gap-2">
                        <StatusIcon className="h-5 w-5" />
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-400">₹{order.total}</p>
                        <p className="text-sm text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Progress */}
                  <div className="mt-6 pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <div className={`flex items-center gap-2 ${order.status === 'pending' ? 'text-yellow-400' : 'text-gray-400'}`}>
                        <div className={`w-3 h-3 rounded-full ${order.status === 'pending' ? 'bg-yellow-400' : 'bg-gray-600'}`}></div>
                        <span className="text-sm">Pending</span>
                      </div>
                      <div className={`flex items-center gap-2 ${order.status === 'confirmed' ? 'text-blue-400' : 'text-gray-400'}`}>
                        <div className={`w-3 h-3 rounded-full ${order.status === 'confirmed' ? 'bg-blue-400' : 'bg-gray-600'}`}></div>
                        <span className="text-sm">Confirmed</span>
                      </div>
                      <div className={`flex items-center gap-2 ${order.status === 'shipped' ? 'text-purple-400' : 'text-gray-400'}`}>
                        <div className={`w-3 h-3 rounded-full ${order.status === 'shipped' ? 'bg-purple-400' : 'bg-gray-600'}`}></div>
                        <span className="text-sm">Shipped</span>
                      </div>
                      <div className={`flex items-center gap-2 ${order.status === 'delivered' ? 'text-green-400' : 'text-gray-400'}`}>
                        <div className={`w-3 h-3 rounded-full ${order.status === 'delivered' ? 'bg-green-400' : 'bg-gray-600'}`}></div>
                        <span className="text-sm">Delivered</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}