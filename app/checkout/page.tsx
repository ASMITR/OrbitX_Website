'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, CreditCard, Smartphone, QrCode, User, Mail, Phone, MapPin } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface CustomerDetails {
  name: string
  email: string
  phone: string
  address: string
  city: string
  pincode: string
}

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCart()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: ''
  })

  useEffect(() => {
    if (items.length === 0) {
      router.push('/merchandise')
    }
    
    // Load saved customer details
    const saved = localStorage.getItem('orbitx-customer')
    if (saved) {
      setCustomerDetails(JSON.parse(saved))
    }
  }, [items, router])

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem('orbitx-customer', JSON.stringify(customerDetails))
    setStep(2)
  }

  const handlePayment = async (method: string) => {
    try {
      const orderData = {
        items,
        customerDetails,
        total: getTotalPrice(),
        paymentMethod: method,
        status: 'pending'
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })

      if (response.ok) {
        const order = await response.json()
        clearCart()
        toast.success('Order placed successfully!')
        router.push(`/orders/${order.id}`)
      } else {
        toast.error('Failed to place order')
      }
    } catch (error) {
      toast.error('Payment failed')
    }
  }

  if (items.length === 0) return null

  return (
    <div className="min-h-screen pt-20 px-4 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="max-w-4xl mx-auto">
        <motion.button
          onClick={() => step === 1 ? router.back() : setStep(1)}
          className="flex items-center text-blue-400 hover:text-blue-300 mb-6"
          whileHover={{ x: -5 }}
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </motion.button>

        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl p-6"
          >
            <h1 className="text-2xl font-bold text-white mb-6">Customer Details</h1>
            
            <form onSubmit={handleDetailsSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={customerDetails.name}
                      onChange={(e) => setCustomerDetails(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-400 focus:outline-none"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={customerDetails.email}
                      onChange={(e) => setCustomerDetails(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-400 focus:outline-none"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      required
                      value={customerDetails.phone}
                      onChange={(e) => setCustomerDetails(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-400 focus:outline-none"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">City</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={customerDetails.city}
                      onChange={(e) => setCustomerDetails(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-400 focus:outline-none"
                      placeholder="Enter your city"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Address</label>
                <textarea
                  required
                  value={customerDetails.address}
                  onChange={(e) => setCustomerDetails(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-400 focus:outline-none"
                  placeholder="Enter your full address"
                  rows={3}
                />
              </div>

              <div className="w-full md:w-1/2">
                <label className="block text-gray-300 mb-2">Pincode</label>
                <input
                  type="text"
                  required
                  value={customerDetails.pincode}
                  onChange={(e) => setCustomerDetails(prev => ({ ...prev, pincode: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-400 focus:outline-none"
                  placeholder="Enter pincode"
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                Proceed to Payment
              </motion.button>
            </form>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h1 className="text-2xl font-bold text-white mb-4">Payment Options</h1>
              <div className="text-gray-300 mb-6">
                Total Amount: <span className="text-2xl font-bold text-green-400">₹{getTotalPrice()}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* UPI Apps */}
                <motion.button
                  onClick={() => handlePayment('phonepe')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-4 bg-purple-600/20 border border-purple-500/30 rounded-xl hover:bg-purple-600/30 transition-all duration-200 flex items-center space-x-3"
                >
                  <Smartphone className="h-8 w-8 text-purple-400" />
                  <div className="text-left">
                    <div className="text-white font-semibold">PhonePe</div>
                    <div className="text-gray-400 text-sm">Pay with PhonePe</div>
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => handlePayment('googlepay')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-4 bg-blue-600/20 border border-blue-500/30 rounded-xl hover:bg-blue-600/30 transition-all duration-200 flex items-center space-x-3"
                >
                  <Smartphone className="h-8 w-8 text-blue-400" />
                  <div className="text-left">
                    <div className="text-white font-semibold">Google Pay</div>
                    <div className="text-gray-400 text-sm">Pay with Google Pay</div>
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => handlePayment('paytm')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-4 bg-cyan-600/20 border border-cyan-500/30 rounded-xl hover:bg-cyan-600/30 transition-all duration-200 flex items-center space-x-3"
                >
                  <Smartphone className="h-8 w-8 text-cyan-400" />
                  <div className="text-left">
                    <div className="text-white font-semibold">Paytm</div>
                    <div className="text-gray-400 text-sm">Pay with Paytm</div>
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => handlePayment('upi')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-4 bg-green-600/20 border border-green-500/30 rounded-xl hover:bg-green-600/30 transition-all duration-200 flex items-center space-x-3"
                >
                  <QrCode className="h-8 w-8 text-green-400" />
                  <div className="text-left">
                    <div className="text-white font-semibold">UPI ID</div>
                    <div className="text-gray-400 text-sm">Pay with UPI ID</div>
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => handlePayment('qr')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-4 bg-orange-600/20 border border-orange-500/30 rounded-xl hover:bg-orange-600/30 transition-all duration-200 flex items-center space-x-3"
                >
                  <QrCode className="h-8 w-8 text-orange-400" />
                  <div className="text-left">
                    <div className="text-white font-semibold">QR Code</div>
                    <div className="text-gray-400 text-sm">Scan QR to pay</div>
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => handlePayment('card')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-4 bg-yellow-600/20 border border-yellow-500/30 rounded-xl hover:bg-yellow-600/30 transition-all duration-200 flex items-center space-x-3"
                >
                  <CreditCard className="h-8 w-8 text-yellow-400" />
                  <div className="text-left">
                    <div className="text-white font-semibold">Credit/Debit Card</div>
                    <div className="text-gray-400 text-sm">Pay with card</div>
                  </div>
                </motion.button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Order Summary</h2>
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={index} className="flex justify-between text-gray-300">
                    <span>{item.name} x {item.quantity}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="border-t border-white/10 pt-3 flex justify-between text-white font-bold">
                  <span>Total</span>
                  <span>₹{getTotalPrice()}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}