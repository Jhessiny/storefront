import type { AuthRepository } from '@/domain/repositories'
import type { User } from '@/domain/entities'
import type { DomainError } from '@/shared/errors'
import type { Either } from '@/shared/utils/either'

export class SignUp {
  constructor(private readonly repository: AuthRepository) {}

  execute(
    email: string,
    password: string
  ): Promise<Either<DomainError, User>> {
    return this.repository.signUp(email, password)
  }
}
