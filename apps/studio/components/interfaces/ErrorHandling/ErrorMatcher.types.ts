import { ReactNode } from 'react'

export interface ErrorMapping {
  /** Unique identifier for this error type */
  id: string
  /** Pattern to match against error message (string or RegExp) */
  pattern: string | RegExp
  /** Display title for the error */
  title: string
  /** Troubleshooting content — compose section components as children */
  content: ReactNode
  /** Priority for matching (higher = matched first) */
  priority?: number
}

export interface ErrorMatchResult {
  /** The matched error mapping */
  mapping: ErrorMapping
  /** The original error message */
  originalMessage: string
  /** Any captured groups from regex match */
  captures?: Record<string, string>
}
