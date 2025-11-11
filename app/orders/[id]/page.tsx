'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Copy, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import toast from 'react-hot-toast'

interface Order {
  id: string
  orderId: string
  items: any[]
  customerDetails: any
  total: number
  paymentMethod: string
  status: string
  createdAt: any
}

export default function OrderPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderDoc = await getDoc(doc(db, 'orders', params.id))
        if (orderDoc.exists()) {
          setOrder({ id: orderDoc.id, ...orderDoc.data() } as Order)
        }
      } catch (error) {
        console.error('Error fetching order:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [params.id])

  const copyOrderId = () => {
    if (order) {
      navigator.clipboard.writeText(order.orderId)
      toast.success('Order ID copied!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 px-4 bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen pt-20 px-4 bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-white">Order not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 px-4 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="max-w-4xl mx-auto">
        <motion.button
          onClick={() => router.push('/merchandise')}
          className="flex items-center text-blue-400 hover:text-blue-300 mb-6"
          whileHover={{ x: -5 }}
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Continue Shopping
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center"
        >
          <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-300 mb-6">Thank you for your order. We'll process it shortly.</p>

          <div className="bg-white/5 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-gray-300">Order ID:</span>
              <span className="text-white font-mono font-bold">{order.orderId}</span>
              <button
                onClick={copyOrderId}
                className="text-blue-400 hover:text-blue-300"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-3">Customer Details</h3>
              <div className="space-y-2 text-gray-300 text-sm">
                <div>Name: {order.customerDetails.name}</div>
                <div>Email: {order.customerDetails.email}</div>
                <div>Phone: {order.customerDetails.phone}</div>
                <div>Address: {order.customerDetails.address}, {order.customerDetails.city} - {order.customerDetails.pincode}</div>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-3">Order Summary</h3>
              <div className="space-y-2 text-gray-300 text-sm">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{item.name} x {item.quantity}</span>
                    <span>₹{item.total}</span>
                  </div>
                ))}
                <div className="border-t border-white/10 pt-2 flex justify-between font-bold text-white">
                  <span>Total</span>
                  <span>₹{order.total}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-gray-400 text-sm">
            Payment Method: {order.paymentMethod.toUpperCase()}
          </div>
        </motion.div>
      </div>
    </div>
  )
}