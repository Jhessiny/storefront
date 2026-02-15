import type { Product } from '@/domain/entities'

export const mockProduct: Product = {
  id: 'mock-prod-001',
  title: 'Wireless Noise-Cancelling Headphones',
  slug: 'wireless-noise-cancelling-headphones',
  description:
    'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and crystal-clear audio. Features Bluetooth 5.3, multipoint connection, and a comfortable memory foam design.',
  brand: 'AudioTech',
  price: 299.99,
  compareAtPrice: 349.99,
  categoryId: 'mock-cat-001',
  thumbnailUrl:
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
  rating: 4.7,
  stock: 50,
  stripeProductId: null,
  stripePriceId: null,
  isActive: true,
  images: [
    {
      id: 'mock-img-001',
      productId: 'mock-prod-001',
      url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
      altText: 'Wireless headphones front view',
      sortOrder: 0
    },
    {
      id: 'mock-img-002',
      productId: 'mock-prod-001',
      url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800',
      altText: 'Wireless headphones side view',
      sortOrder: 1
    }
  ],
  category: { name: 'Electronics', slug: 'electronics' },
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z'
}

export const mockProducts: Product[] = [
  mockProduct,
  {
    id: 'mock-prod-002',
    title: 'Smart Fitness Watch',
    slug: 'smart-fitness-watch',
    description:
      'Track your health and fitness with GPS, heart rate monitor, sleep tracking, and 7-day battery life.',
    brand: 'FitPro',
    price: 199.99,
    compareAtPrice: null,
    categoryId: 'mock-cat-001',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    rating: 4.5,
    stock: 75,
    stripeProductId: null,
    stripePriceId: null,
    isActive: true,
    images: [],
    category: { name: 'Electronics', slug: 'electronics' },
    createdAt: '2025-01-02T00:00:00Z',
    updatedAt: '2025-01-02T00:00:00Z'
  },
  {
    id: 'mock-prod-003',
    title: 'Organic Cotton T-Shirt',
    slug: 'organic-cotton-t-shirt',
    description:
      'Soft, sustainable organic cotton t-shirt. Available in multiple colors. Fair trade certified.',
    brand: 'EcoWear',
    price: 29.99,
    compareAtPrice: 39.99,
    categoryId: 'mock-cat-002',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    rating: 4.3,
    stock: 200,
    stripeProductId: null,
    stripePriceId: null,
    isActive: true,
    images: [],
    category: { name: 'Clothing', slug: 'clothing' },
    createdAt: '2025-01-03T00:00:00Z',
    updatedAt: '2025-01-03T00:00:00Z'
  },
  {
    id: 'mock-prod-004',
    title: 'Running Shoes Ultra',
    slug: 'running-shoes-ultra',
    description:
      'Lightweight running shoes with responsive cushioning and breathable mesh upper.',
    brand: 'SpeedRun',
    price: 129.99,
    compareAtPrice: 159.99,
    categoryId: 'mock-cat-003',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    rating: 4.5,
    stock: 90,
    stripeProductId: null,
    stripePriceId: null,
    isActive: true,
    images: [],
    category: { name: 'Sports', slug: 'sports' },
    createdAt: '2025-01-04T00:00:00Z',
    updatedAt: '2025-01-04T00:00:00Z'
  }
]
