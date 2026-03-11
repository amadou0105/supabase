import { ResponseError } from './base'
import type { ErrorMetadata } from './base'

export type KnownErrorType = 'connection-timeout' | 'failed-to-retrieve-projects'

export class ConnectionTimeoutError extends ResponseError {
  readonly errorType = 'connection-timeout' as const

  constructor(
    message: string | undefined,
    code?: number,
    requestId?: string,
    retryAfter?: number,
    requestPathname?: string,
    metadata?: ErrorMetadata
  ) {
    super(message, code, requestId, retryAfter, requestPathname, metadata)
  }
}

export class FailedToRetrieveProjectsError extends ResponseError {
  readonly errorType = 'failed-to-retrieve-projects' as const

  constructor(
    message: string | undefined,
    code?: number,
    requestId?: string,
    retryAfter?: number,
    requestPathname?: string,
    metadata?: ErrorMetadata
  ) {
    super(message, code, requestId, retryAfter, requestPathname, metadata)
  }
}

export type ClassifiedError = ConnectionTimeoutError | FailedToRetrieveProjectsError
