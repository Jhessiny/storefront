export type CartItem = {
  id: string
  userId: string
  productId: string
  quantity: number
  createdAt: string
  updatedAt: string
  product?: {
    id: string
    title: string
    slug: string
    price: number
    thumbnailUrl: string
    stock: number
    stripePriceId: string | null
  }
}

export type LocalCartItem = {
  productId: string
  quantity: number
  product: {
    id: string
    title: string
    slug: string
    price: number
    thumbnailUrl: string
    stock: number
    stripePriceId: string | null
  }
}
