'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Package, Calendar, CreditCard } from 'lucide-react'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

import Link from 'next/link'

interface Order {
  id: string
  orderId: string
  total: number
  status: string
  paymentMethod: string
  createdAt: any
  items: any[]
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)


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
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen pt-20 px-4 bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-white">Loading orders...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 px-4 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl text-gray-300 mb-2">No orders yet</h2>
            <p className="text-gray-400 mb-6">Start shopping to see your orders here</p>
            <Link
              href="/merchandise"
              className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <h3 className="text-white font-semibold text-lg">Order #{order.orderId}</h3>
                    <div className="flex items-center text-gray-400 text-sm mt-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      {order.createdAt?.toDate?.()?.toLocaleDateString() || 'Recent'}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 mt-4 md:mt-0">
                    <div className="text-right">
                      <div className="text-white font-semibold">₹{order.total}</div>
                      <div className="flex items-center text-gray-400 text-sm">
                        <CreditCard className="h-4 w-4 mr-1" />
                        {order.paymentMethod}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      order.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3 bg-white/5 rounded-lg p-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <div className="text-white text-sm font-medium">{item.name}</div>
                        <div className="text-gray-400 text-xs">Qty: {item.quantity}</div>
                      </div>
                      <div className="text-white text-sm font-semibold">₹{item.total}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-end">
                  <Link
                    href={`/orders/${order.id}`}
                    className="px-4 py-2 bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-all duration-200 text-sm"
                  >
                    View Details
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