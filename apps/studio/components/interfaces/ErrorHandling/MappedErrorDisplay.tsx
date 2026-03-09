'use client'

import { useEffect, useMemo, useRef } from 'react'
import { ErrorDisplay } from 'ui-patterns/ErrorDisplay'
import { useTrack } from 'lib/telemetry/track'
import { matchError } from './ErrorMatcher'
import type { ErrorMapping } from './ErrorMatcher.types'
import { allMappingFactories } from './errorMappings'

interface MappedErrorDisplayProps {
  /** The error message to display and match */
  error: string | { message: string }
  /** Optional custom error mappings (merged with defaults) */
  customMappings?: ErrorMapping[]
  /** URL for support link */
  supportUrl?: string
  /** Project reference for support context */
  projectRef?: string
  /** Callback for restart project action */
  onRestartProject?: () => void
  /** Callback for debug with AI action */
  onDebugWithAI?: () => void
  /** Additional CSS classes */
  className?: string
}

/**
 * MappedErrorDisplay automatically matches error messages to troubleshooting UI.
 *
 * It uses pattern matching to find the appropriate troubleshooting steps
 * and renders them inside an ErrorDisplay component.
 *
 * Tracks error display events via PostHog (10% sampled).
 *
 * @example
 * ```tsx
 * <MappedErrorDisplay
 *   error="ERROR: FAILED TO RUN SQL QUERY: CONNECTION TERMINATED DUE TO CONNECTION TIMEOUT."
 *   projectRef={projectRef}
 *   onRestartProject={handleRestart}
 *   onDebugWithAI={openAIDebugger}
 *   supportUrl="/support/new"
 * />
 * ```
 */
export function MappedErrorDisplay({
  error,
  customMappings,
  supportUrl = '/support/new',
  projectRef,
  onRestartProject,
  onDebugWithAI,
  className,
}: MappedErrorDisplayProps) {
  const track = useTrack()
  const hasTrackedRenderRef = useRef(false)

  const errorMessage = typeof error === 'string' ? error : error.message

  // Build default mappings with callbacks injected
  const defaultMappings = useMemo(
    () =>
      allMappingFactories.map((factory) =>
        factory({
          onRestartProject,
          onDebugWithAI,
          buildPrompt: () => errorMessage,
        })
      ),
    [onRestartProject, onDebugWithAI, errorMessage]
  )

  const matchResult = matchError(errorMessage, [...defaultMappings, ...(customMappings ?? [])])

  // Track error display on mount (with sampling)
  useEffect(() => {
    if (!hasTrackedRenderRef.current && Math.random() < 0.1) {
      hasTrackedRenderRef.current = true
      track('dashboard_error_created', {
        source: 'error_display',
        error_type: matchResult?.mapping.id,
        has_troubleshooting: matchResult ? true : false,
      })
    }
  }, [track, matchResult])

  if (!matchResult) {
    return (
      <ErrorDisplay
        title="An error occurred"
        errorMessage={errorMessage}
        supportUrl={supportUrl}
        className={className}
      />
    )
  }

  const { mapping } = matchResult

  return (
    <ErrorDisplay
      title={mapping.title}
      errorMessage={errorMessage}
      supportUrl={supportUrl}
      className={className}
    >
      {mapping.content}
    </ErrorDisplay>
  )
}
