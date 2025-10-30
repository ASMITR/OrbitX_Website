'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface CartItem {
  merchandiseId: string
  name: string
  price: number
  image: string
  size?: string
  color?: string
  quantity: number
  total: number
}

interface CartContextType {
  items: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (merchandiseId: string, size?: string, color?: string) => void
  updateQuantity: (merchandiseId: string, quantity: number, size?: string, color?: string) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('orbitx-cart')
    if (savedCart) {
      setItems(JSON.parse(savedCart))
    }
  }, [])

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('orbitx-cart', JSON.stringify(items))
  }, [items])

  const addToCart = (newItem: CartItem) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(item => 
        item.merchandiseId === newItem.merchandiseId &&
        item.size === newItem.size &&
        item.color === newItem.color
      )

      if (existingIndex >= 0) {
        const updated = [...prev]
        updated[existingIndex].quantity += newItem.quantity
        updated[existingIndex].total = updated[existingIndex].quantity * updated[existingIndex].price
        return updated
      } else {
        return [...prev, newItem]
      }
    })
  }

  const removeFromCart = (merchandiseId: string, size?: string, color?: string) => {
    setItems(prev => prev.filter(item => 
      !(item.merchandiseId === merchandiseId &&
        item.size === size &&
        item.color === color)
    ))
  }

  const updateQuantity = (merchandiseId: string, quantity: number, size?: string, color?: string) => {
    if (quantity <= 0) {
      removeFromCart(merchandiseId, size, color)
      return
    }

    setItems(prev => prev.map(item => {
      if (item.merchandiseId === merchandiseId &&
          item.size === size &&
          item.color === color) {
        return {
          ...item,
          quantity,
          total: quantity * item.price
        }
      }
      return item
    }))
  }

  const clearCart = () => {
    setItems([])
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.total, 0)
  }

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}