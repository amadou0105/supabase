'use client'

import { useTrack } from 'lib/telemetry/track'
import { ErrorDisplay } from 'ui-patterns/ErrorDisplay'

import { ERROR_MAPPINGS } from './error-mappings'

interface ErrorMatcherProps {
  error: string | { message: string }
  supportUrl?: string
  className?: string
}

export function ErrorMatcher({ error, supportUrl = '/support/new', className }: ErrorMatcherProps) {
  const track = useTrack()

  const message = typeof error === 'string' ? error : error.message
  const mapping = ERROR_MAPPINGS.find((m) => m.pattern.test(message)) ?? null

  if (!mapping) {
    return (
      <ErrorDisplay
        title="An error occurred"
        errorMessage={message}
        supportUrl={supportUrl}
        className={className}
      />
    )
  }

  return (
    <ErrorDisplay
      title={mapping.title}
      errorMessage={message}
      supportUrl={supportUrl}
      className={className}
      onRender={() => track('inline_error_troubleshooter_shown', { error_type: mapping.id })}
      onSupportClick={() =>
        track('inline_error_troubleshooter_action_clicked', {
          error_type: mapping.id,
          action: 'contact_support',
        })
      }
    >
      {mapping.troubleshooting}
    </ErrorDisplay>
  )
}
