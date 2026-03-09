export { ErrorDisplay } from 'ui-patterns/ErrorDisplay'
export type { ErrorDisplayProps } from 'ui-patterns/ErrorDisplay'

export { MappedErrorDisplay } from './MappedErrorDisplay'
export { TroubleshootingAccordion } from './TroubleshootingAccordion'
export {
  RestartDatabaseTroubleshootingSection,
  TroubleshootingGuideSection,
  FixWithAITroubleshootingSection,
} from './TroubleshootingSections'

export type { ErrorMapping } from './ErrorMatcher.types'

// Re-export error mapping factories for customization
export * from './errorMappings'
