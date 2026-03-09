import { ErrorMapping } from '../ErrorMatcher.types'

export type ErrorMappingFactory = (params?: {
  projectRef?: string
  onRestartProject?: () => void
  onDebugWithAI?: () => void
}) => ErrorMapping
