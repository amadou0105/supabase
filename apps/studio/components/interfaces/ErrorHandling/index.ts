export { ErrorDisplay } from 'ui-patterns/ErrorDisplay'
export type { ErrorDisplayProps } from 'ui-patterns/ErrorDisplay'

export { MappedErrorDisplay } from './MappedErrorDisplay'
export { TroubleshootingAccordion } from './TroubleshootingAccordion'
export { TroubleshootingStep } from './TroubleshootingStep'
export { matchError, createErrorMapping } from './ErrorMatcher'

export type {
  ErrorMapping,
  ErrorMatchResult,
  TroubleshootingStepConfig,
  TroubleshootingAction,
} from './ErrorMatcher.types'

// Re-export error mapping factories for customization
export * from './errorMappings'
