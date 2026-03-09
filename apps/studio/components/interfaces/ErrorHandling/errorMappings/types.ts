import { ErrorMapping } from '../ErrorMatcher.types'

export type ErrorMappingFactory = (params?: {
  onRestartProject?: () => void
  onDebugWithAI?: () => void
  buildPrompt?: () => string
}) => ErrorMapping
