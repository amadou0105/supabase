'use client'

import { useEffect, useRef } from 'react'
import { ErrorDisplay } from 'ui-patterns/ErrorDisplay'
import { useTrack } from 'lib/telemetry/track'
import { matchError } from './ErrorMatcher'
import type { ErrorMapping } from './ErrorMatcher.types'
import { TroubleshootingAccordion } from './TroubleshootingAccordion'

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
 * Includes PostHog event tracking for:
 * - Error display events (sampled at 10%)
 * - Accordion step expansion
 * - Action button clicks
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

  // Match error to troubleshooting configuration
  const matchResult = matchError(errorMessage, customMappings)

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

  // Track accordion step expansion
  const handleStepExpand = (stepNumber: number) => {
    track('error_troubleshooting_step_expanded', {
      step_number: stepNumber,
      error_type: matchResult?.mapping.id,
    })
  }

  // Track action button clicks
  const handleActionClick = (stepNumber: number, actionLabel: string) => {
    track('error_troubleshooting_action_clicked', {
      step_number: stepNumber,
      action_label: actionLabel,
      error_type: matchResult?.mapping.id,
    })
  }

  if (!matchResult) {
    // Fallback for unmatched errors - just show the error without specific troubleshooting
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

  // Inject dynamic action handlers into steps
  const stepsWithHandlers = mapping.steps.map((step) => ({
    ...step,
    actions: step.actions?.map((action) => {
      // Inject restart handler
      if (action.label.toLowerCase().includes('restart') && onRestartProject) {
        return { ...action, onClick: onRestartProject }
      }
      // Inject AI debug handler
      if (action.label.toLowerCase().includes('ai') && onDebugWithAI) {
        return { ...action, onClick: onDebugWithAI }
      }
      return action
    }),
  }))

  return (
    <ErrorDisplay
      title={mapping.title}
      errorMessage={errorMessage}
      supportUrl={supportUrl}
      className={className}
    >
      <TroubleshootingAccordion
        steps={stepsWithHandlers}
        onStepExpand={handleStepExpand}
        onActionClick={handleActionClick}
      />
    </ErrorDisplay>
  )
}
