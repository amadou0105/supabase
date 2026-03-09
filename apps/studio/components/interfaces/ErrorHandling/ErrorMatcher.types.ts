import { ReactNode } from 'react'

export interface TroubleshootingStepConfig {
  /** Step number (1, 2, 3, etc.) */
  number: number
  /** Step title */
  title: string
  /** Step description */
  description?: string | ReactNode
  /** Action buttons for this step */
  actions?: TroubleshootingAction[]
}

export interface TroubleshootingAction {
  /** Button label */
  label: string
  /** Click handler */
  onClick?: () => void
  /** External URL (renders as link) */
  href?: string
  /** Button variant */
  variant?: 'default' | 'primary' | 'destructive'
  /** Icon to show */
  icon?: ReactNode
}

export interface ErrorMapping {
  /** Unique identifier for this error type */
  id: string
  /** Pattern to match against error message (string or RegExp) */
  pattern: string | RegExp
  /** Display title for the error */
  title: string
  /** Troubleshooting steps */
  steps: TroubleshootingStepConfig[]
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
