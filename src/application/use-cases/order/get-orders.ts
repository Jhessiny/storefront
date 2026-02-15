import type { OrderRepository } from '@/domain/repositories'
import type { Order } from '@/domain/entities'
import type { DomainError } from '@/shared/errors'
import type { Either } from '@/shared/utils/either'

export class GetOrders {
  constructor(private readonly repository: OrderRepository) {}

  execute(userId: string): Promise<Either<DomainError, Order[]>> {
    return this.repository.getByUserId(userId)
  }
}
