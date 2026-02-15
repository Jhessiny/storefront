import type { CategoryRepository } from '@/domain/repositories'
import type { Category } from '@/domain/entities'
import type { DomainError } from '@/shared/errors'
import type { Either } from '@/shared/utils/either'

export class GetCategories {
  constructor(private readonly repository: CategoryRepository) {}

  execute(): Promise<Either<DomainError, Category[]>> {
    return this.repository.getAll()
  }
}
