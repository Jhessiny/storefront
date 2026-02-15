import type { ProductRepository } from '@/domain/repositories'
import type { Product, ProductFilters } from '@/domain/entities'
import type { PaginatedResponse, PaginationParams } from '@/shared/types'
import type { DomainError } from '@/shared/errors'
import type { Either } from '@/shared/utils/either'

export class GetProducts {
  constructor(private readonly repository: ProductRepository) {}

  execute(
    filters: ProductFilters,
    pagination: PaginationParams
  ): Promise<Either<DomainError, PaginatedResponse<Product>>> {
    return this.repository.getAll(filters, pagination)
  }
}
