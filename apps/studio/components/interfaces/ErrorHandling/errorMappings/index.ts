import { connectionTimeoutMapping } from './ConnectionTimeout'
import { ErrorMapping } from '../ErrorMatcher.types'
import { ErrorMappingFactory } from './types'

export { connectionTimeoutMapping }
export type { ErrorMappingFactory }

// All mapping factories — used to build mappings with injected callbacks at render time
export const allMappingFactories: ErrorMappingFactory[] = [
  connectionTimeoutMapping,
  // Add more mapping factories here as needed:
  // resourceExceededMapping,
  // authenticationFailedMapping,
]

// Pre-built mappings with no callbacks (used for pattern matching only)
export const allErrorMappings: ErrorMapping[] = allMappingFactories.map((f) => f())
