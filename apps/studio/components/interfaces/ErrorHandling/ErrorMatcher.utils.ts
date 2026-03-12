import type { KnownErrorType } from 'types/api-errors'

import { ERROR_MAPPINGS, type ErrorMapping } from './error-mappings'

function isKnownErrorType(type: unknown): type is KnownErrorType {
  return typeof type === 'string' && type in ERROR_MAPPINGS
}

export function getMappingForError(error: unknown): ErrorMapping | null {
  if (typeof error !== 'object' || error === null) return null
  const errorType = 'errorType' in error ? (error as { errorType: unknown }).errorType : undefined
  return isKnownErrorType(errorType) ? ERROR_MAPPINGS[errorType] : null
}
