import type { ResponseError } from './base'

export type KnownErrorType = 'connection-timeout' | 'failed-to-retrieve-projects'

export type ClassifiedError = ResponseError & { errorType: KnownErrorType }
