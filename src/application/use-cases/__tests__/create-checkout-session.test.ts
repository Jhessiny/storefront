import { describe, it, expect, vi } from 'vitest'
import { CreateCheckoutSession } from '../payment/create-checkout-session'
import { right, left, isLeft, isRight } from '@/shared/utils/either'
import type { PaymentRepository, OrderRepository } from '@/domain/repositories'
import type { LocalCartItem, Order } from '@/domain/entities'

const mockCartItem: LocalCartItem = {
  productId: 'prod-1',
  quantity: 2,
  product: {
    id: 'prod-1',
    title: 'Test',
    slug: 'test',
    price: 29.99,
    thumbnailUrl: 'https://example.com/img.jpg',
    stock: 10,
    stripePriceId: 'price_123'
  }
}

const mockOrder: Order = {
  id: 'order-1',
  userId: 'user-1',
  status: 'pending',
  total: 59.98,
  stripeSessionId: null,
  stripePaymentIntentId: null,
  items: [],
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01'
}

describe('CreateCheckoutSession', () => {
  it('returns validation error for empty cart', async () => {
    const paymentRepo = { createCheckoutSession: vi.fn() } as unknown as PaymentRepository
    const orderRepo = { create: vi.fn() } as unknown as OrderRepository

    const useCase = new CreateCheckoutSession(paymentRepo, orderRepo)
    const result = await useCase.execute('user-1', [], '/success', '/cancel')

    expect(isLeft(result)).toBe(true)
    if (isLeft(result)) {
      expect(result.value.message).toContain('empty')
    }
  })

  it('returns validation error for missing stripe price', async () => {
    const itemWithoutPrice = {
      ...mockCartItem,
      product: { ...mockCartItem.product, stripePriceId: null }
    }
    const paymentRepo = { createCheckoutSession: vi.fn() } as unknown as PaymentRepository
    const orderRepo = { create: vi.fn() } as unknown as OrderRepository

    const useCase = new CreateCheckoutSession(paymentRepo, orderRepo)
    const result = await useCase.execute(
      'user-1',
      [itemWithoutPrice],
      '/success',
      '/cancel'
    )

    expect(isLeft(result)).toBe(true)
    if (isLeft(result)) {
      expect(result.value.message).toContain('not available')
    }
  })

  it('creates order and checkout session on success', async () => {
    const orderRepo = {
      create: vi.fn().mockResolvedValue(right(mockOrder)),
      updateStatus: vi.fn().mockResolvedValue(right(undefined))
    } as unknown as OrderRepository

    const paymentRepo = {
      createCheckoutSession: vi
        .fn()
        .mockResolvedValue(right({ id: 'cs_123', url: 'https://stripe.com/pay' }))
    } as unknown as PaymentRepository

    const useCase = new CreateCheckoutSession(paymentRepo, orderRepo)
    const result = await useCase.execute(
      'user-1',
      [mockCartItem],
      '/success',
      '/cancel'
    )

    expect(isRight(result)).toBe(true)
    if (isRight(result)) {
      expect(result.value.url).toBe('https://stripe.com/pay')
    }
  })
})
