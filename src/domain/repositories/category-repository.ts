import type { Either } from '@/shared/utils/either'
import type { DomainError } from '@/shared/errors'
import type { Category } from '../entities/category'

export interface CategoryRepository {
  getAll(): Promise<Either<DomainError, Category[]>>
}
