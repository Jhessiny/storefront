import type { PaymentRepository } from '@/domain/repositories'
import type { OrderRepository } from '@/domain/repositories'
import type { CheckoutSession } from '@/domain/repositories'
import type { LocalCartItem } from '@/domain/entities'
import type { DomainError } from '@/shared/errors'
import type { Either } from '@/shared/utils/either'
import { left, isLeft } from '@/shared/utils/either'
import { ValidationError } from '@/shared/errors'

export class CreateCheckoutSession {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly orderRepository: OrderRepository
  ) {}

  async execute(
    userId: string,
    items: LocalCartItem[],
    successUrl: string,
    cancelUrl: string
  ): Promise<Either<DomainError, CheckoutSession>> {
    if (items.length === 0) {
      return left(new ValidationError('Cart is empty'))
    }

    const missingPrice = items.find((item) => !item.product.stripePriceId)
    if (missingPrice) {
      return left(
        new ValidationError(
          `Product "${missingPrice.product.title}" is not available for purchase`
        )
      )
    }

    // Create a pending order first
    const orderResult = await this.orderRepository.create(
      userId,
      items,
      '' // will be updated after session creation
    )

    if (isLeft(orderResult)) return orderResult

    const order = orderResult.value

    // Create Stripe checkout session
    const sessionResult = await this.paymentRepository.createCheckoutSession(
      items,
      order.id,
      successUrl,
      cancelUrl
    )

    if (isLeft(sessionResult)) return sessionResult

    // Update order with stripe session id
    await this.orderRepository.updateStatus(order.id, 'pending')

    return sessionResult
  }
}
