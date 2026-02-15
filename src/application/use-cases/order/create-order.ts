import type { OrderRepository } from '@/domain/repositories'
import type { Order, LocalCartItem } from '@/domain/entities'
import type { DomainError } from '@/shared/errors'
import type { Either } from '@/shared/utils/either'

export class CreateOrder {
  constructor(private readonly repository: OrderRepository) {}

  execute(
    userId: string,
    items: LocalCartItem[],
    stripeSessionId: string
  ): Promise<Either<DomainError, Order>> {
    return this.repository.create(userId, items, stripeSessionId)
  }
}
