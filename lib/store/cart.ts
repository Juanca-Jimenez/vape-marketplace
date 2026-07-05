import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export interface CartProduct {
  id: string
  name: string
  brand: string
  flavor: string
  price: number
  image: string
  quantity: number
}

interface CartState {
  items: CartProduct[]
  addItem: (product: CartProduct) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  total: number
  count: number
}

const storage = typeof window !== 'undefined'
  ? createJSONStorage(() => localStorage)
  : undefined

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        set((state) => {
          const quantity = Number(product.quantity) || 1
          const existingIndex = state.items.findIndex((item) => item.id === product.id)

          if (existingIndex >= 0) {
            const nextItems = [...state.items]
            nextItems[existingIndex] = {
              ...nextItems[existingIndex],
              quantity: nextItems[existingIndex].quantity + quantity,
            }
            return { items: nextItems }
          }

          return { items: [...state.items, { ...product, quantity }] }
        })
      },
      removeItem: (productId) => {
        set((state) => ({ items: state.items.filter((item) => item.id !== productId) }))
      },
      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items: state.items
            .map((item) => (item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item))
            .filter((item) => item.quantity > 0),
        }))
      },
      clearCart: () => set({ items: [] }),
      get total() {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      },
      get count() {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },
    }),
    {
      name: 'vape_cart',
      storage,
    }
  )
)

export function useCart() {
  const state = useCartStore()

  return {
    cart: state.items,
    items: state.items,
    count: state.count,
    total: state.total,
    addToCart: state.addItem,
    addItem: state.addItem,
    removeFromCart: state.removeItem,
    removeItem: state.removeItem,
    updateQuantity: state.updateQuantity,
    clearCart: state.clearCart,
  }
}
