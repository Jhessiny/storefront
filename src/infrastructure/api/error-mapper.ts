import {
  DatabaseError,
  NotFoundError,
  AuthenticationError,
  ExternalServiceError
} from '@/shared/errors'
import type { DomainError } from '@/shared/errors'

type SupabaseError = {
  code?: string
  message: string
  details?: string
}

export function mapSupabaseError(
  error: SupabaseError,
  entity = 'Record'
): DomainError {
  if (error.code === 'PGRST116' || error.code === '22P02') {
    return new NotFoundError(entity)
  }
  if (
    error.code === 'PGRST301' ||
    error.message?.includes('JWT') ||
    error.message?.includes('auth')
  ) {
    return new AuthenticationError()
  }
  return new DatabaseError(error.message || 'An unexpected database error occurred')
}

export function mapStripeError(error: unknown): DomainError {
  if (error instanceof Error) {
    return new ExternalServiceError(`Stripe error: ${error.message}`)
  }
  return new ExternalServiceError('An unexpected payment error occurred')
}
