import type { AuthRepository } from '@/domain/repositories'
import type { Session } from '@/domain/entities'
import type { DomainError } from '@/shared/errors'
import type { Either } from '@/shared/utils/either'

export class SignIn {
  constructor(private readonly repository: AuthRepository) {}

  execute(
    email: string,
    password: string
  ): Promise<Either<DomainError, Session>> {
    return this.repository.signIn(email, password)
  }
}
