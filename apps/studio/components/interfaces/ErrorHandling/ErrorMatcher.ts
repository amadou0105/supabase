import { allErrorMappings } from './errorMappings'
import { ErrorMapping, ErrorMatchResult } from './ErrorMatcher.types'

/**
 * Matches an error message against registered error patterns
 * and returns the corresponding troubleshooting configuration.
 *
 * @param errorMessage - The error message to match
 * @param customMappings - Optional additional mappings (merged with defaults)
 * @returns ErrorMatchResult if a match is found, undefined otherwise
 */
export function matchError(
  errorMessage: string,
  customMappings?: ErrorMapping[]
): ErrorMatchResult | undefined {
  const mappings = [...(customMappings ?? []), ...allErrorMappings].sort(
    (a, b) => (b.priority ?? 0) - (a.priority ?? 0)
  )

  for (const mapping of mappings) {
    const { pattern } = mapping

    if (typeof pattern === 'string') {
      // Case-insensitive substring match
      if (errorMessage.toUpperCase().includes(pattern.toUpperCase())) {
        return {
          mapping,
          originalMessage: errorMessage,
        }
      }
    } else {
      // Regex match
      const match = errorMessage.match(pattern)
      if (match) {
        return {
          mapping,
          originalMessage: errorMessage,
          captures: match.groups,
        }
      }
    }
  }

  return undefined
}

/**
 * Creates a custom error mapping for one-off use
 */
export function createErrorMapping(
  config: Omit<ErrorMapping, 'id'> & { id?: string }
): ErrorMapping {
  return {
    id: config.id ?? `custom-${Date.now()}`,
    priority: config.priority ?? 0,
    ...config,
  }
}
