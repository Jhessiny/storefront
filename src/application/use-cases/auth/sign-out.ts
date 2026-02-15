import type { AuthRepository } from '@/domain/repositories'
import type { DomainError } from '@/shared/errors'
import type { Either } from '@/shared/utils/either'

export class SignOut {
  constructor(private readonly repository: AuthRepository) {}

  execute(): Promise<Either<DomainError, void>> {
    return this.repository.signOut()
  }
}
