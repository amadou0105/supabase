import { describe, expect, it } from 'vitest'
import { matchError, createErrorMapping } from './ErrorMatcher'
import type { ErrorMapping } from './ErrorMatcher.types'

describe('ErrorMatcher', () => {
  describe('matchError', () => {
    const testMappings: ErrorMapping[] = [
      {
        id: 'test-timeout',
        pattern: 'CONNECTION TIMEOUT',
        title: 'Connection timeout error',
        content: null,
        priority: 10,
      },
      {
        id: 'test-auth',
        pattern: /AUTHENTICATION\s+FAILED/i,
        title: 'Authentication error',
        content: null,
        priority: 5,
      },
    ]

    it('matches string patterns case-insensitively', () => {
      const result = matchError('connection timeout occurred', testMappings)
      expect(result).toBeDefined()
      expect(result?.mapping.id).toBe('test-timeout')
    })

    it('matches regex patterns', () => {
      const result = matchError('AUTHENTICATION FAILED for user', testMappings)
      expect(result).toBeDefined()
      expect(result?.mapping.id).toBe('test-auth')
    })

    it('respects priority ordering', () => {
      const mappings: ErrorMapping[] = [
        { id: 'low-priority', pattern: 'ERROR', title: 'Generic error', content: null, priority: 1 },
        { id: 'high-priority', pattern: 'ERROR', title: 'Specific error', content: null, priority: 10 },
      ]
      const result = matchError('ERROR occurred', mappings)
      expect(result?.mapping.id).toBe('high-priority')
    })

    it('returns undefined for unmatched errors', () => {
      const result = matchError('UNMATCHED ERROR', testMappings)
      expect(result).toBeUndefined()
    })

    it('captures regex groups', () => {
      const mappings: ErrorMapping[] = [
        { id: 'with-capture', pattern: /ERROR: (?<code>\d+)/, title: 'Error with code', content: null },
      ]
      const result = matchError('ERROR: 500', mappings)
      expect(result?.captures).toEqual({ code: '500' })
    })

    it('includes original message in result', () => {
      const errorMessage = 'CONNECTION TIMEOUT occurred'
      const result = matchError(errorMessage, testMappings)
      expect(result?.originalMessage).toBe(errorMessage)
    })

    it('matches custom mappings', () => {
      const customMapping: ErrorMapping = {
        id: 'custom',
        pattern: 'CUSTOM ERROR',
        title: 'Custom',
        content: null,
      }
      const result = matchError('CUSTOM ERROR', [customMapping])
      expect(result?.mapping.id).toBe('custom')
    })
  })

  describe('createErrorMapping', () => {
    it('creates a mapping with provided id', () => {
      const mapping = createErrorMapping({ id: 'custom-id', pattern: 'TEST', title: 'Test', content: null })
      expect(mapping.id).toBe('custom-id')
    })

    it('generates id when not provided', () => {
      const mapping = createErrorMapping({ pattern: 'TEST', title: 'Test', content: null })
      expect(mapping.id).toMatch(/^custom-\d+$/)
    })

    it('sets default priority to 0', () => {
      const mapping = createErrorMapping({ pattern: 'TEST', title: 'Test', content: null })
      expect(mapping.priority).toBe(0)
    })

    it('respects provided priority', () => {
      const mapping = createErrorMapping({ pattern: 'TEST', title: 'Test', content: null, priority: 5 })
      expect(mapping.priority).toBe(5)
    })
  })
})
