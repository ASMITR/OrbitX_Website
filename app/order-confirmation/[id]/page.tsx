'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, Package, User, MapPin, Phone, Mail, ArrowLeft } from 'lucide-react'
import { Order } from '@/lib/types'
import toast from 'react-hot-toast'

export default function OrderConfirmationPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchOrder(params.id as string)
    }
  }, [params.id])

  const fetchOrder = async (id: string) => {
    try {
      const response = await fetch(`/api/orders/${id}`)
      if (response.ok) {
        const data = await response.json()
        setOrder(data)
      } else {
        toast.error('Order not found')
        router.push('/merchandise')
      }
    } catch (error) {
      console.error('Error fetching order:', error)
      toast.error('Failed to load order')
      router.push('/merchandise')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-400 mb-2">Order not found</h3>
          <button onClick={() => router.push('/merchandise')} className="btn-primary">
            Back to Merchandise
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white pt-16">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">Order Confirmed!</h1>
          <p className="text-gray-300">Thank you for your order. We'll process it shortly.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Details */}
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Order Details
            </h2>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Order Number:</span>
                <span className="text-white font-bold">{order.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                  order.status === 'confirmed' ? 'bg-blue-500/20 text-blue-400' :
                  order.status === 'shipped' ? 'bg-purple-500/20 text-purple-400' :
                  order.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Order Date:</span>
                <span className="text-white">{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="border-t border-white/20 pt-4">
              <h3 className="text-lg font-bold text-white mb-3">Items Ordered</h3>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex gap-3 p-3 bg-white/5 rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="text-white font-medium text-sm">{item.name}</h4>
                      {item.size && <p className="text-gray-400 text-xs">Size: {item.size}</p>}
                      {item.color && <p className="text-gray-400 text-xs">Color: {item.color}</p>}
                      <p className="text-blue-400 font-bold text-sm">₹{item.price} × {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold text-sm">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/20 mt-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-white">Total:</span>
                  <span className="text-2xl font-bold text-blue-400">₹{order.total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Customer Information
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="h-4 w-4 text-gray-400 mt-1" />
                <div>
                  <p className="text-gray-400 text-sm">Name</p>
                  <p className="text-white font-medium">{order.customerInfo.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-gray-400 mt-1" />
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white font-medium">{order.customerInfo.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-gray-400 mt-1" />
                <div>
                  <p className="text-gray-400 text-sm">Phone</p>
                  <p className="text-white font-medium">{order.customerInfo.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                <div>
                  <p className="text-gray-400 text-sm">Delivery Address</p>
                  <p className="text-white font-medium">{order.customerInfo.address}</p>
                  {order.customerInfo.city && (
                    <p className="text-gray-300 text-sm">
                      {order.customerInfo.city}
                      {order.customerInfo.state && `, ${order.customerInfo.state}`}
                      {order.customerInfo.pincode && ` - ${order.customerInfo.pincode}`}
                    </p>
                  )}
                </div>
              </div>

              {order.customerInfo.notes && (
                <div className="border-t border-white/20 pt-4">
                  <p className="text-gray-400 text-sm mb-1">Order Notes</p>
                  <p className="text-white text-sm">{order.customerInfo.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="text-center mt-8 space-y-4">
          <p className="text-gray-300">
            We'll send you updates about your order via email and SMS.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push('/my-orders')}
              className="group px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/50 flex items-center gap-2"
            >
              <Package className="h-5 w-5 group-hover:rotate-12 transition-transform" />
              Track Orders
            </button>
            <button
              onClick={() => router.push('/merchandise')}
              className="px-6 py-2 bg-white/10 text-gray-300 rounded-lg hover:bg-white/20 transition-colors"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}