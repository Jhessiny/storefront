import type { PaymentRepository, CheckoutSession } from '@/domain/repositories'
import type { LocalCartItem } from '@/domain/entities'
import type { DomainError } from '@/shared/errors'
import type { Either } from '@/shared/utils/either'
import { left } from '@/shared/utils/either'
import { ExternalServiceError } from '@/shared/errors'

export class NoopPaymentRepository implements PaymentRepository {
  async createCheckoutSession(
    _items: LocalCartItem[],
    _orderId: string,
    _successUrl: string,
    _cancelUrl: string
  ): Promise<Either<DomainError, CheckoutSession>> {
    return left(new ExternalServiceError('Payment is not configured'))
  }
}
