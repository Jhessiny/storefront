import type { Either } from '@/shared/utils/either'
import type { DomainError } from '@/shared/errors'
import type { Session, User } from '../entities/user'

export interface AuthRepository {
  signIn(
    email: string,
    password: string
  ): Promise<Either<DomainError, Session>>

  signUp(
    email: string,
    password: string
  ): Promise<Either<DomainError, User>>

  signOut(): Promise<Either<DomainError, void>>

  getSession(): Promise<Either<DomainError, Session | null>>
}
