'use client'

import { useTrack } from 'lib/telemetry/track'
import { useMemo } from 'react'
import { ErrorDisplay } from 'ui-patterns/ErrorDisplay'

import { allMappingFactories } from './errorMappings'
import { matchError } from './ErrorMatcher'
import type { ErrorMapping } from './ErrorMatcher.types'

interface MappedErrorDisplayProps {
  error: string | { message: string }
  customMappings?: ErrorMapping[]
  supportUrl?: string
  onRestartProject?: () => void
  onDebugWithAI?: () => void
  className?: string
}

export function MappedErrorDisplay({
  error,
  customMappings,
  supportUrl = '/support/new',
  onRestartProject,
  onDebugWithAI,
  className,
}: MappedErrorDisplayProps) {
  const track = useTrack()

  const errorMessage = typeof error === 'string' ? error : error.message

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
      onRender={() => track('inline_error_troubleshooter_shown', { error_type: mapping.id })}
      onSupportClick={() => track('inline_error_troubleshooter_action_clicked', { error_type: mapping.id, action: 'contact_support' })}
    >
      {mapping.content}
    </ErrorDisplay>
  )
}
