import { ReactNode } from 'react'

import { ConnectionTimeoutTroubleshooting } from './errorMappings/ConnectionTimeout'

export interface ErrorMapping {
  id: string
  pattern: RegExp
  troubleshooting: ReactNode
}

export const ERROR_MAPPINGS: ErrorMapping[] = [
  {
    id: 'connection-timeout',
    pattern: /CONNECTION\s+TERMINATED\s+DUE\s+TO\s+CONNECTION\s+TIMEOUT/i,
    troubleshooting: <ConnectionTimeoutTroubleshooting />,
  },
]
