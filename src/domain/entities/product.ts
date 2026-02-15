export type Product = {
  id: string
  title: string
  slug: string
  description: string
  brand: string
  price: number
  compareAtPrice: number | null
  categoryId: string
  thumbnailUrl: string
  rating: number
  stock: number
  stripeProductId: string | null
  stripePriceId: string | null
  isActive: boolean
  images: ProductImage[]
  category?: { name: string; slug: string }
  createdAt: string
  updatedAt: string
}

export type ProductImage = {
  id: string
  productId: string
  url: string
  altText: string | null
  sortOrder: number
}

export type ProductFilters = {
  categorySlug?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'rating'
}
