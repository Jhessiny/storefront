import type { AuthRepository } from '@/domain/repositories'
import type { Session } from '@/domain/entities'
import type { DomainError } from '@/shared/errors'
import type { Either } from '@/shared/utils/either'

export class GetSession {
  constructor(private readonly repository: AuthRepository) {}

  execute(): Promise<Either<DomainError, Session | null>> {
    return this.repository.getSession()
  }
}
