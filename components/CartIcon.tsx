'use client'

import { useState } from 'react'
import { ShoppingCart, X, Plus, Minus, Trash2 } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

export default function CartIcon() {
  const [isOpen, setIsOpen] = useState(false)
  const { items, removeFromCart, updateQuantity, getTotalItems, getTotalPrice } = useCart()

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative group p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 border border-blue-400/30 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
      >
        <ShoppingCart className="h-5 w-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
        {getTotalItems() > 0 && (
          <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse shadow-lg">
            {getTotalItems()}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 h-full w-96 bg-gray-900 border-l border-gray-700 z-50 flex flex-col"
            >
              <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">Shopping Cart</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-gray-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {items.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-400">Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="bg-gray-800 rounded-lg p-3">
                        <div className="flex gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h3 className="text-white font-medium text-sm">{item.name}</h3>
                            {item.size && (
                              <p className="text-gray-400 text-xs">Size: {item.size}</p>
                            )}
                            {item.color && (
                              <p className="text-gray-400 text-xs">Color: {item.color}</p>
                            )}
                            <p className="text-blue-400 font-bold text-sm">₹{item.price}</p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-400 hover:text-red-300 p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 rounded bg-gray-700 flex items-center justify-center text-white hover:bg-gray-600"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-white text-sm w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 rounded bg-gray-700 flex items-center justify-center text-white hover:bg-gray-600"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="text-white font-bold text-sm">
                            ₹{item.price * item.quantity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {items.length > 0 && (
                <div className="p-4 border-t border-gray-700">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-white font-bold">Total:</span>
                    <span className="text-blue-400 font-bold text-lg">₹{getTotalPrice()}</span>
                  </div>
                  <Link href="/checkout">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium transition-colors"
                    >
                      Proceed to Checkout
                    </button>
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}