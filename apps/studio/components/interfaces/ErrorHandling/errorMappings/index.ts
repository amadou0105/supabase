import { ErrorMapping } from '../ErrorMatcher.types'
import { connectionTimeoutMapping } from './ConnectionTimeout'
import { ErrorMappingFactory } from './types'

export { connectionTimeoutMapping }
export type { ErrorMappingFactory }

export const allMappingFactories: ErrorMappingFactory[] = [connectionTimeoutMapping]

export const allErrorMappings: ErrorMapping[] = allMappingFactories.map((f) => f())
