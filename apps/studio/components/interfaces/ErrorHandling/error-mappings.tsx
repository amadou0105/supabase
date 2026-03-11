import { ComponentType } from 'react'
import type { KnownErrorType } from 'types/api-errors'

import { ConnectionTimeoutTroubleshooting } from './errorMappings/ConnectionTimeout'

export interface ErrorMapping {
  id: KnownErrorType
  Troubleshooting: ComponentType
}

export const ERROR_MAPPINGS: Record<KnownErrorType, ErrorMapping> = {
  'connection-timeout': {
    id: 'connection-timeout',
    Troubleshooting: ConnectionTimeoutTroubleshooting,
  },
}
