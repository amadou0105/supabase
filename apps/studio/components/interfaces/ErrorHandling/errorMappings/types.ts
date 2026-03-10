import { ErrorMapping } from '../ErrorMatcher.types'

export type ErrorMappingFactory = (params?: {
  onRestartProject?: () => void
  onDebugWithAI?: (prompt: string) => void
}) => ErrorMapping
