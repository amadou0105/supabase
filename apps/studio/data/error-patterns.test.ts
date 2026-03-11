import { describe, expect, it } from 'vitest'

import { ERROR_PATTERNS } from './error-patterns'

// Representative sample messages for each error type.
// Keep this in sync when adding new patterns.
const PATTERN_SAMPLES: Record<string, { matches: string[]; nonMatches: string[] }> = {
  'connection-timeout': {
    matches: [
      'CONNECTION TERMINATED DUE TO CONNECTION TIMEOUT',
      'connection terminated due to connection timeout',
      'ERROR: FAILED TO RUN SQL QUERY: CONNECTION TERMINATED DUE TO CONNECTION TIMEOUT.',
      'Connection  Terminated  Due  To  Connection  Timeout', // extra whitespace
    ],
    nonMatches: [
      'connection timeout',
      'connection terminated',
      'query timed out',
      'idle connection timeout',
      '',
    ],
  },
}

describe('ERROR_PATTERNS registry', () => {
  it('has no duplicate errorType values', () => {
    const types = ERROR_PATTERNS.map((p) => p.errorType)
    const unique = new Set(types)
    expect(unique.size).toBe(types.length)
  })

  it('has a PATTERN_SAMPLES entry for every registered pattern (keep samples in sync)', () => {
    for (const { errorType } of ERROR_PATTERNS) {
      expect(
        PATTERN_SAMPLES,
        `Add a PATTERN_SAMPLES entry for '${errorType}'`
      ).toHaveProperty(errorType)
    }
  })

  describe('per-pattern match correctness', () => {
    for (const { errorType, pattern } of ERROR_PATTERNS) {
      const samples = PATTERN_SAMPLES[errorType]
      if (!samples) continue

      describe(errorType, () => {
        it.each(samples.matches)('matches: %s', (msg) => {
          expect(pattern.test(msg)).toBe(true)
        })

        it.each(samples.nonMatches)('does not match: %s', (msg) => {
          expect(pattern.test(msg)).toBe(false)
        })
      })
    }
  })

  describe('no message matches more than one pattern', () => {
    // Collect all sample messages across all error types
    const allSamples = Object.entries(PATTERN_SAMPLES).flatMap(([errorType, { matches }]) =>
      matches.map((msg) => ({ msg, sourceType: errorType }))
    )

    it.each(allSamples)(
      '$sourceType sample "$msg" matches exactly one pattern',
      ({ msg }) => {
        const matched = ERROR_PATTERNS.filter(({ pattern }) => pattern.test(msg))
        expect(matched.length).toBe(1)
      }
    )
  })
})
