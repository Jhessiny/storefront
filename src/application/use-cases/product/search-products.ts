import type { ProductRepository } from '@/domain/repositories'
import type { Product } from '@/domain/entities'
import type { PaginatedResponse, PaginationParams } from '@/shared/types'
import type { DomainError } from '@/shared/errors'
import type { Either } from '@/shared/utils/either'

export class SearchProducts {
  constructor(private readonly repository: ProductRepository) {}

  execute(
    query: string,
    pagination: PaginationParams
  ): Promise<Either<DomainError, PaginatedResponse<Product>>> {
    return this.repository.search(query, pagination)
  }
}
