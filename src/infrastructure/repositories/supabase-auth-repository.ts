import type { SupabaseClient } from '@supabase/supabase-js'
import type { AuthRepository } from '@/domain/repositories'
import type { Session, User } from '@/domain/entities'
import type { DomainError } from '@/shared/errors'
import type { Either } from '@/shared/utils/either'
import { left, right } from '@/shared/utils/either'
import { AuthenticationError } from '@/shared/errors'

export class SupabaseAuthRepository implements AuthRepository {
  constructor(private readonly client: SupabaseClient) {}

  async signIn(
    email: string,
    password: string
  ): Promise<Either<DomainError, Session>> {
    const { data, error } = await this.client.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      return left(new AuthenticationError(error.message))
    }

    return right({
      user: {
        id: data.user.id,
        email: data.user.email!,
        createdAt: data.user.created_at
      },
      accessToken: data.session.access_token
    })
  }

  async signUp(
    email: string,
    password: string
  ): Promise<Either<DomainError, User>> {
    const { data, error } = await this.client.auth.signUp({
      email,
      password
    })

    if (error) {
      return left(new AuthenticationError(error.message))
    }

    if (!data.user) {
      return left(new AuthenticationError('Sign up failed'))
    }

    return right({
      id: data.user.id,
      email: data.user.email!,
      createdAt: data.user.created_at
    })
  }

  async signOut(): Promise<Either<DomainError, void>> {
    const { error } = await this.client.auth.signOut()

    if (error) {
      return left(new AuthenticationError(error.message))
    }

    return right(undefined)
  }

  async getSession(): Promise<Either<DomainError, Session | null>> {
    const {
      data: { session },
      error
    } = await this.client.auth.getSession()

    if (error) {
      return left(new AuthenticationError(error.message))
    }

    if (!session) {
      return right(null)
    }

    return right({
      user: {
        id: session.user.id,
        email: session.user.email!,
        createdAt: session.user.created_at
      },
      accessToken: session.access_token
    })
  }
}
