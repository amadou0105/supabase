import { ErrorMapping } from '../ErrorMatcher.types'
import { connectionTimeoutMapping } from './connectionTimeout'

// Register all error mappings here
export const allErrorMappings: ErrorMapping[] = [
  connectionTimeoutMapping(),
  // Add more mappings here as needed:
  // resourceExceededMapping(),
  // authenticationFailedMapping(),
  // etc.
]

// Factory exports for customized mappings
export { connectionTimeoutMapping }
export type { ErrorMappingFactory } from './types'
