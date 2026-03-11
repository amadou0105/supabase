import { ConnectionTimeoutError } from 'types/api-errors'
import type { ClassifiedError } from 'types/api-errors'
import type { ResponseError } from 'types/base'

interface ErrorPattern {
  pattern: RegExp
  ErrorClass: new (...args: ConstructorParameters<typeof ResponseError>) => ClassifiedError
}

export const ERROR_PATTERNS: ErrorPattern[] = [
  {
    pattern: /CONNECTION\s+TERMINATED\s+DUE\s+TO\s+CONNECTION\s+TIMEOUT/i,
    ErrorClass: ConnectionTimeoutError,
  },
]
