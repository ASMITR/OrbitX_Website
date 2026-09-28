'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface CartItem {
  id: string
  merchandiseId: string
  name: string
  price: number
  originalPrice?: number
  image: string
  size?: string
  color?: string
  quantity: number
  stock?: number
  category?: string
  discount?: number
}

interface CartContextType {
  items: CartItem[]
  addToCart: (item: Omit<CartItem, 'id'>) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  getSubtotal: () => number
  getTotalDiscount: () => number
  getShippingCost: () => number
  applyPromoCode: (code: string) => boolean
  removePromoCode: () => void
  promoCode: string | null
  promoDiscount: number
  recentlyRemoved: CartItem | null
  restoreItem: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const PROMO_CODES = {
  'ORBITX10': 10,
  'SPACE20': 20,
  'WELCOME15': 15,
  'STUDENT25': 25
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [promoCode, setPromoCode] = useState<string | null>(null)
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [recentlyRemoved, setRecentlyRemoved] = useState<CartItem | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('cart')
    const savedPromo = localStorage.getItem('promoCode')
    const savedDiscount = localStorage.getItem('promoDiscount')
    
    if (saved) setItems(JSON.parse(saved))
    if (savedPromo) setPromoCode(savedPromo)
    if (savedDiscount) setPromoDiscount(Number(savedDiscount))
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  useEffect(() => {
    if (promoCode) {
      localStorage.setItem('promoCode', promoCode)
      localStorage.setItem('promoDiscount', promoDiscount.toString())
    } else {
      localStorage.removeItem('promoCode')
      localStorage.removeItem('promoDiscount')
    }
  }, [promoCode, promoDiscount])

  const addToCart = (item: Omit<CartItem, 'id'>) => {
    const existingItem = items.find(i => 
      i.merchandiseId === item.merchandiseId && 
      i.size === item.size && 
      i.color === item.color
    )

    if (existingItem) {
      updateQuantity(existingItem.id, existingItem.quantity + item.quantity)
    } else {
      const newItem = { ...item, id: Date.now().toString() }
      setItems(prev => [...prev, newItem])
    }
  }

  const removeFromCart = (id: string) => {
    const itemToRemove = items.find(item => item.id === id)
    if (itemToRemove) {
      setRecentlyRemoved(itemToRemove)
      setTimeout(() => setRecentlyRemoved(null), 10000) // Clear after 10 seconds
    }
    setItems(prev => prev.filter(item => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity } : item
    ))
  }

  const clearCart = () => {
    setItems([])
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getSubtotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getTotalDiscount = () => {
    const itemDiscount = items.reduce((total, item) => {
      const discount = item.originalPrice ? (item.originalPrice - item.price) * item.quantity : 0
      return total + discount
    }, 0)
    const promoDiscountAmount = (getSubtotal() * promoDiscount) / 100
    return itemDiscount + promoDiscountAmount
  }

  const getShippingCost = () => {
    const subtotal = getSubtotal()
    return subtotal >= 500 ? 0 : 50 // Free shipping above ₹500
  }

  const getTotalPrice = () => {
    return getSubtotal() - getTotalDiscount() + getShippingCost()
  }

  const applyPromoCode = (code: string) => {
    const discount = PROMO_CODES[code as keyof typeof PROMO_CODES]
    if (discount) {
      setPromoCode(code)
      setPromoDiscount(discount)
      return true
    }
    return false
  }

  const removePromoCode = () => {
    setPromoCode(null)
    setPromoDiscount(0)
  }

  const restoreItem = () => {
    if (recentlyRemoved) {
      setItems(prev => [...prev, recentlyRemoved])
      setRecentlyRemoved(null)
    }
  }

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
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
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}