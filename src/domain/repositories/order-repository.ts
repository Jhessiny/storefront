import type { Either } from '@/shared/utils/either'
import type { DomainError } from '@/shared/errors'
import type { Order, OrderStatus } from '../entities/order'
import type { LocalCartItem } from '../entities/cart'

export interface OrderRepository {
  create(
    userId: string,
    items: LocalCartItem[],
    stripeSessionId: string
  ): Promise<Either<DomainError, Order>>

  getByUserId(userId: string): Promise<Either<DomainError, Order[]>>

  getById(
    orderId: string,
    userId: string
  ): Promise<Either<DomainError, Order>>

  updateStatus(
    orderId: string,
    status: OrderStatus
  ): Promise<Either<DomainError, void>>

  getByStripeSessionId(
    sessionId: string
  ): Promise<Either<DomainError, Order>>
}
