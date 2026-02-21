import type { PaymentRepository, CheckoutSession } from '@/domain/repositories'
import type { LocalCartItem } from '@/domain/entities'
import type { DomainError } from '@/shared/errors'
import type { Either } from '@/shared/utils/either'
import { left, right } from '@/shared/utils/either'
import { stripe } from '../api/stripe-server'
import { mapStripeError } from '../api/error-mapper'

export class StripePaymentRepository implements PaymentRepository {
  async createCheckoutSession(
    items: LocalCartItem[],
    orderId: string,
    successUrl: string,
    cancelUrl: string
  ): Promise<Either<DomainError, CheckoutSession>> {
    try {
      const lineItems = items.map((item) => ({
        price: item.product.stripePriceId!,
        quantity: item.quantity
      }))

      const session = await stripe!.checkout.sessions.create({
        mode: 'payment',
        line_items: lineItems,
        success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl,
        metadata: {
          order_id: orderId
        }
      })

      return right({
        id: session.id,
        url: session.url!
      })
    } catch (error) {
      return left(mapStripeError(error))
    }
  }
}
