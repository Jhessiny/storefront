import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { LocalCartItem } from '@/domain/entities'

interface CartState {
  items: LocalCartItem[]
  addItem: (item: LocalCartItem) => void
  removeItem: (productId: string) => void
  increaseQuantity: (productId: string) => void
  decreaseQuantity: (productId: string) => void
  clearCart: () => void
  setItems: (items: LocalCartItem[]) => void
  totalItems: () => number
  totalPrice: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === item.productId
          )
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              )
            }
          }
          return { items: [...state.items, item] }
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId)
        })),

      increaseQuantity: (productId) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId
              ? { ...i, quantity: i.quantity + 1 }
              : i
          )
        })),

      decreaseQuantity: (productId) =>
        set((state) => {
          const item = state.items.find((i) => i.productId === productId)
          if (item && item.quantity <= 1) {
            return {
              items: state.items.filter((i) => i.productId !== productId)
            }
          }
          return {
            items: state.items.map((i) =>
              i.productId === productId
                ? { ...i, quantity: i.quantity - 1 }
                : i
            )
          }
        }),

      clearCart: () => set({ items: [] }),

      setItems: (items) => set({ items }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () =>
        get().items.reduce(
          (sum, i) => sum + i.product.price * i.quantity,
          0
        )
    }),
    { name: 'cart-storage' }
  )
)
