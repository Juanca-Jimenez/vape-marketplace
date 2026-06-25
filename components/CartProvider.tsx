'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

export interface CartProduct {
  id: string
  name: string
  brand: string
  flavor: string
  price: number
  image: string
  quantity: number
}

interface CartContextValue {
  cart: CartProduct[]
  count: number
  total: number
  addToCart: (product: CartProduct) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)
const STORAGE_KEY = 'vape_cart'

function loadCart(): CartProduct[] {
  if (typeof window === 'undefined') return []

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const stored = JSON.parse(raw)
    return Array.isArray(stored) ? stored : []
  } catch {
    return []
  }
}

function saveCart(cart: CartProduct[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartProduct[]>([])

  useEffect(() => {
    setCart(loadCart())
  }, [])

  useEffect(() => {
    saveCart(cart)
  }, [cart])

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        setCart(event.newValue ? (JSON.parse(event.newValue) as CartProduct[]) : [])
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const addToCart = (product: CartProduct) => {
    setCart((current) => {
      const existingIndex = current.findIndex((item) => item.id === product.id)
      if (existingIndex >= 0) {
        const next = [...current]
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + product.quantity,
        }
        return next
      }
      return [...current, product]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart((current) => current.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    setCart((current) =>
      current
        .map((item) => (item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item))
        .filter((item) => item.quantity > 0)
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const count = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart])
  const total = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart])

  const value = useMemo(
    () => ({ cart, count, total, addToCart, removeFromCart, updateQuantity, clearCart }),
    [cart, count, total]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used inside CartProvider')
  }
  return context
}
