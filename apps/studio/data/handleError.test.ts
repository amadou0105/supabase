import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ResponseError } from 'types/base'
import type { ClassifiedError } from 'types/api-errors'

vi.mock('@sentry/nextjs', () => ({ captureException: vi.fn() }))
vi.mock('common', () => ({ IS_PLATFORM: false, getAccessToken: vi.fn() }))
vi.mock('lib/constants', () => ({ API_URL: 'http://localhost' }))
vi.mock('lib/helpers', () => ({ uuidv4: () => 'test-uuid' }))

// Import after mocks are set up
const { handleError } = await import('./fetchers')

function throwAndCatch(error: unknown): ResponseError {
  try {
    handleError(error)
  } catch (e) {
    return e as ResponseError
  }
  throw new Error('handleError did not throw')
}

function isClassifiedError(e: ResponseError): e is ClassifiedError {
  return 'errorType' in e
}

describe('handleError — error classification', () => {
  beforeEach(() => vi.clearAllMocks())

  describe('known patterns', () => {
    it('classifies connection timeout via message field', () => {
      const err = throwAndCatch({
        message: 'CONNECTION TERMINATED DUE TO CONNECTION TIMEOUT',
      })
      expect(isClassifiedError(err)).toBe(true)
      expect((err as ClassifiedError).errorType).toBe('connection-timeout')
    })

    it('classifies connection timeout via msg field', () => {
      const err = throwAndCatch({
        msg: 'ERROR: CONNECTION TERMINATED DUE TO CONNECTION TIMEOUT',
      })
      expect(isClassifiedError(err)).toBe(true)
      expect((err as ClassifiedError).errorType).toBe('connection-timeout')
    })

    it('classification is case-insensitive', () => {
      const err = throwAndCatch({ message: 'connection terminated due to connection timeout' })
      expect((err as ClassifiedError).errorType).toBe('connection-timeout')
    })

    it('classified error is still instanceof ResponseError', () => {
      const err = throwAndCatch({
        message: 'CONNECTION TERMINATED DUE TO CONNECTION TIMEOUT',
      })
      expect(err).toBeInstanceOf(ResponseError)
    })
  })

  describe('unclassified errors', () => {
    it('throws plain ResponseError for unknown messages', () => {
      const err = throwAndCatch({ message: 'something went wrong' })
      expect(err).toBeInstanceOf(ResponseError)
      expect(isClassifiedError(err)).toBe(false)
    })

    it('throws plain ResponseError for empty message', () => {
      const err = throwAndCatch({ message: '' })
      // empty message falls through to the Sentry path → generic ResponseError
      expect(err).toBeInstanceOf(ResponseError)
    })

    it('throws generic ResponseError for null', () => {
      const err = throwAndCatch(null)
      expect(err).toBeInstanceOf(ResponseError)
      expect(isClassifiedError(err)).toBe(false)
    })

    it('throws generic ResponseError for non-object', () => {
      const err = throwAndCatch('raw string error')
      expect(err).toBeInstanceOf(ResponseError)
    })
  })

  describe('field preservation', () => {
    it('preserves all ResponseError fields on classified errors', () => {
      const err = throwAndCatch({
        message: 'CONNECTION TERMINATED DUE TO CONNECTION TIMEOUT',
        code: 503,
        requestId: 'req-abc',
        retryAfter: 30,
        requestPathname: '/rest/v1/table',
      })
      expect(err.message).toBe('CONNECTION TERMINATED DUE TO CONNECTION TIMEOUT')
      expect(err.code).toBe(503)
      expect(err.requestId).toBe('req-abc')
      expect(err.retryAfter).toBe(30)
      expect(err.requestPathname).toBe('/rest/v1/table')
    })

    it('preserves all ResponseError fields on unclassified errors', () => {
      const err = throwAndCatch({
        message: 'some error',
        code: 500,
        requestId: 'req-xyz',
      })
      expect(err.code).toBe(500)
      expect(err.requestId).toBe('req-xyz')
    })

    it('msg field takes priority over message field for error text', () => {
      const err = throwAndCatch({ msg: 'from msg field', message: 'from message field' })
      expect(err.message).toBe('from msg field')
    })
  })
})
