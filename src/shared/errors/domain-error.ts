export abstract class DomainError extends Error {
  abstract readonly code: string

  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
  }
}

export class NotFoundError extends DomainError {
  readonly code = 'NOT_FOUND'

  constructor(entity: string, identifier?: string) {
    super(
      identifier
        ? `${entity} with identifier "${identifier}" was not found`
        : `${entity} was not found`
    )
  }
}

export class ValidationError extends DomainError {
  readonly code = 'VALIDATION_ERROR'
}

export class AuthenticationError extends DomainError {
  readonly code = 'AUTHENTICATION_ERROR'

  constructor(message = 'Authentication required') {
    super(message)
  }
}

export class AuthorizationError extends DomainError {
  readonly code = 'AUTHORIZATION_ERROR'

  constructor(message = 'You do not have permission to perform this action') {
    super(message)
  }
}

export class PaymentError extends DomainError {
  readonly code = 'PAYMENT_ERROR'
}

export class DatabaseError extends DomainError {
  readonly code = 'DATABASE_ERROR'
}

export class ExternalServiceError extends DomainError {
  readonly code = 'EXTERNAL_SERVICE_ERROR'
}
