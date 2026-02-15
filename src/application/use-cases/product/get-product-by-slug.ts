import type { ProductRepository } from '@/domain/repositories'
import type { Product } from '@/domain/entities'
import type { DomainError } from '@/shared/errors'
import type { Either } from '@/shared/utils/either'

export class GetProductBySlug {
  constructor(private readonly repository: ProductRepository) {}

  execute(slug: string): Promise<Either<DomainError, Product>> {
    return this.repository.getBySlug(slug)
  }
}
