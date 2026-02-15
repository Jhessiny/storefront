import { describe, it, expect, vi } from 'vitest'
import { GetProducts } from '../product/get-products'
import { right, left, isRight, isLeft } from '@/shared/utils/either'
import { DatabaseError } from '@/shared/errors'
import type { ProductRepository } from '@/domain/repositories'
import type { Product } from '@/domain/entities'

const mockProduct: Product = {
  id: '1',
  title: 'Test Product',
  slug: 'test-product',
  description: 'A test product',
  brand: 'TestBrand',
  price: 29.99,
  compareAtPrice: null,
  categoryId: 'cat-1',
  thumbnailUrl: 'https://example.com/image.jpg',
  rating: 4.5,
  stock: 10,
  stripeProductId: null,
  stripePriceId: null,
  isActive: true,
  images: [],
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01'
}

describe('GetProducts', () => {
  it('returns paginated products on success', async () => {
    const repository: ProductRepository = {
      getAll: vi.fn().mockResolvedValue(
        right({
          data: [mockProduct],
          total: 1,
          page: 1,
          pageSize: 12,
          totalPages: 1
        })
      ),
      getBySlug: vi.fn(),
      search: vi.fn()
    }

    const useCase = new GetProducts(repository)
    const result = await useCase.execute({}, { page: 1, pageSize: 12 })

    expect(isRight(result)).toBe(true)
    if (isRight(result)) {
      expect(result.value.data).toHaveLength(1)
      expect(result.value.data[0].title).toBe('Test Product')
    }
  })

  it('returns error on failure', async () => {
    const repository: ProductRepository = {
      getAll: vi.fn().mockResolvedValue(left(new DatabaseError('DB error'))),
      getBySlug: vi.fn(),
      search: vi.fn()
    }

    const useCase = new GetProducts(repository)
    const result = await useCase.execute({}, { page: 1 })

    expect(isLeft(result)).toBe(true)
    if (isLeft(result)) {
      expect(result.value.message).toBe('DB error')
    }
  })
})
