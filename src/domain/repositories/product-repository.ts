import type { Either } from '@/shared/utils/either'
import type { DomainError } from '@/shared/errors'
import type { PaginatedResponse, PaginationParams } from '@/shared/types'
import type { Product, ProductFilters } from '../entities/product'

export interface ProductRepository {
  getAll(
    filters: ProductFilters,
    pagination: PaginationParams
  ): Promise<Either<DomainError, PaginatedResponse<Product>>>

  getBySlug(slug: string): Promise<Either<DomainError, Product>>

  search(
    query: string,
    pagination: PaginationParams
  ): Promise<Either<DomainError, PaginatedResponse<Product>>>
}
