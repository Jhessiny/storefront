import type { CartRepository } from '@/domain/repositories'
import type { LocalCartItem } from '@/domain/entities'
import type { DomainError } from '@/shared/errors'
import type { Either } from '@/shared/utils/either'

export class SyncCart {
  constructor(private readonly repository: CartRepository) {}

  execute(
    userId: string,
    items: LocalCartItem[]
  ): Promise<Either<DomainError, void>> {
    return this.repository.syncCart(userId, items)
  }
}
