import type { Either } from '@/shared/utils/either'
import type { DomainError } from '@/shared/errors'
import type { LocalCartItem } from '../entities/cart'

export type CheckoutSession = {
  id: string
  url: string
}

export interface PaymentRepository {
  createCheckoutSession(
    items: LocalCartItem[],
    orderId: string,
    successUrl: string,
    cancelUrl: string
  ): Promise<Either<DomainError, CheckoutSession>>
}
