import type { CartRepository } from '@/domain/repositories'
import type { CartItem } from '@/domain/entities'
import type { DomainError } from '@/shared/errors'
import type { Either } from '@/shared/utils/either'

export class LoadCart {
  constructor(private readonly repository: CartRepository) {}

  execute(userId: string): Promise<Either<DomainError, CartItem[]>> {
    return this.repository.getByUserId(userId)
  }
}
