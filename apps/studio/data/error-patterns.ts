import type { KnownErrorType } from 'types/api-errors'

interface ErrorPattern {
  pattern: RegExp
  errorType: KnownErrorType
}

export const ERROR_PATTERNS: ErrorPattern[] = [
  {
    pattern: /CONNECTION\s+TERMINATED\s+DUE\s+TO\s+CONNECTION\s+TIMEOUT/i,
    errorType: 'connection-timeout',
  },
]
