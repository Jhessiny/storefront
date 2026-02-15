export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export type Order = {
  id: string
  userId: string
  status: OrderStatus
  total: number
  stripeSessionId: string | null
  stripePaymentIntentId: string | null
  items: OrderItem[]
  createdAt: string
  updatedAt: string
}

export type OrderItem = {
  id: string
  orderId: string
  productId: string
  quantity: number
  unitPrice: number
  createdAt: string
  product?: {
    title: string
    slug: string
    thumbnailUrl: string
  }
}
