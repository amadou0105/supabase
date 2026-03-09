/**
 * Example usage of the ErrorDisplay component system
 *
 * This file demonstrates how to use the MappedErrorDisplay component
 * in a real application scenario.
 */

import { useState } from 'react'
import { MappedErrorDisplay } from './MappedErrorDisplay'
import type { ErrorMapping } from './ErrorMatcher.types'

/**
 * Example 1: Basic usage with automatic error matching
 */
export function TableListWithErrorHandling({ projectRef }: { projectRef: string }) {
  const [error, setError] = useState<string | null>(null)

  const handleRestartProject = () => {
    console.log('Restarting project...')
    // Your restart logic here
  }

  const handleDebugWithAI = () => {
    console.log('Opening AI debugger...')
    // Your AI debug logic here
  }

  if (error) {
    return (
      <MappedErrorDisplay
        error={error}
        projectRef={projectRef}
        onRestartProject={handleRestartProject}
        onDebugWithAI={handleDebugWithAI}
        supportUrl={`/support/new?project=${projectRef}`}
      />
    )
  }

  return <div>Your component content here</div>
}

/**
 * Example 2: Custom error mapping for domain-specific errors
 */
export function CustomErrorExample() {
  const customErrorMappings: ErrorMapping[] = [
    {
      id: 'custom-auth-error',
      pattern: /INVALID_API_KEY|UNAUTHORIZED/i,
      title: 'Authentication failed',
      priority: 10,
      steps: [
        {
          number: 1,
          title: 'Check your API key',
          description: 'Ensure your API key is correct and has not expired.',
          actions: [
            {
              label: 'View API keys',
              href: '/project/settings/api',
              variant: 'default',
            },
          ],
        },
        {
          number: 2,
          title: 'Regenerate your API key',
          description: 'Create a new API key if the current one is invalid.',
          actions: [
            {
              label: 'Generate new key',
              onClick: () => console.log('Generating new key...'),
              variant: 'primary',
            },
          ],
        },
      ],
    },
  ]

  return (
    <MappedErrorDisplay
      error="ERROR: INVALID_API_KEY"
      customMappings={customErrorMappings}
      supportUrl="/support"
    />
  )
}

/**
 * Example 3: Handling different error formats
 */
export function MultiFormatErrorExample() {
  // Error can be a string
  const stringError = 'CONNECTION TIMEOUT'

  // Or an object with a message property
  const objectError = {
    message: 'ERROR: FAILED TO RUN SQL QUERY: CONNECTION TERMINATED DUE TO CONNECTION TIMEOUT.',
  }

  return (
    <div className="space-y-4">
      <MappedErrorDisplay error={stringError} />
      <MappedErrorDisplay error={objectError} />
    </div>
  )
}

/**
 * Example 4: Integration with React Query
 */
export function ReactQueryIntegration({ projectRef }: { projectRef: string }) {
  // Simulated React Query hook
  const { data, error, isError } = {
    data: null,
    error: new Error('CONNECTION TIMEOUT'),
    isError: true,
  }

  if (isError && error) {
    return (
      <MappedErrorDisplay
        error={error.message}
        projectRef={projectRef}
        supportUrl="/support"
      />
    )
  }

  return <div>Data: {JSON.stringify(data)}</div>
}

/**
 * Example 5: Custom styling with className
 */
export function StyledErrorExample() {
  return (
    <MappedErrorDisplay
      error="CONNECTION TIMEOUT"
      className="my-custom-class max-w-2xl mx-auto"
      supportUrl="/support"
    />
  )
}
