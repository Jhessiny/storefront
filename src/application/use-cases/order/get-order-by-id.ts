import type { OrderRepository } from '@/domain/repositories'
import type { Order } from '@/domain/entities'
import type { DomainError } from '@/shared/errors'
import type { Either } from '@/shared/utils/either'

export class GetOrderById {
  constructor(private readonly repository: OrderRepository) {}

  execute(
    orderId: string,
    userId: string
  ): Promise<Either<DomainError, Order>> {
    return this.repository.getById(orderId, userId)
  }
}
