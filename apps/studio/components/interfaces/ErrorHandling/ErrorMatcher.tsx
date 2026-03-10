'use client'

import { useTrack } from 'lib/telemetry/track'
import { ErrorDisplay, SupportFormParams } from 'ui-patterns/ErrorDisplay'

import { ERROR_MAPPINGS } from './error-mappings'

interface ErrorMatcherProps {
  title: string
  error: string | { message: string }
  supportFormParams?: SupportFormParams
  className?: string
}

export function ErrorMatcher({ title, error, supportFormParams, className }: ErrorMatcherProps) {
  const track = useTrack()

  const message = typeof error === 'string' ? error : error.message
  const mapping = ERROR_MAPPINGS.find((m) => m.pattern.test(message)) ?? null

  if (!mapping) {
    return (
      <ErrorDisplay
        title={title}
        errorMessage={message}
        supportFormParams={supportFormParams}
        className={className}
      />
    )
  }

  return (
    <ErrorDisplay
      title={title}
      errorMessage={message}
      supportFormParams={supportFormParams}
      className={className}
      onRender={() => track('inline_error_troubleshooter_shown', { errorType: mapping.id })}
      onSupportClick={() =>
        track('inline_error_troubleshooter_action_clicked', {
          errorType: mapping.id,
          action: 'contact_support',
        })
      }
    >
      {mapping.troubleshooting}
    </ErrorDisplay>
  )
}
