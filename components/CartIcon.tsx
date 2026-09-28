'use client'

import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useRouter } from 'next/navigation'

export default function CartIcon() {
  const { getTotalItems } = useCart()
  const router = useRouter()

  return (
    <button
      onClick={() => router.push('/cart')}
      className="relative group p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 border border-blue-400/30 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
    >
      <ShoppingCart className="h-5 w-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
      {getTotalItems() > 0 && (
        <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse shadow-lg">
          {getTotalItems()}
        </span>
      )}
    </button>
  )
}