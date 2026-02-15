import type { Either } from '@/shared/utils/either'
import type { DomainError } from '@/shared/errors'
import type { CartItem, LocalCartItem } from '../entities/cart'

export interface CartRepository {
  getByUserId(userId: string): Promise<Either<DomainError, CartItem[]>>

  syncCart(
    userId: string,
    items: LocalCartItem[]
  ): Promise<Either<DomainError, void>>

  clearCart(userId: string): Promise<Either<DomainError, void>>
}
