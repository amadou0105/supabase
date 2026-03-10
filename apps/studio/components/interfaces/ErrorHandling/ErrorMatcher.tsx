'use client'

import {
  createSupportFormUrl,
  SupportFormUrlKeys,
} from 'components/interfaces/Support/SupportForm.utils'
import { useTrack } from 'lib/telemetry/track'
import { ErrorDisplay } from 'ui-patterns/ErrorDisplay'

import { ERROR_MAPPINGS } from './error-mappings'

interface ErrorMatcherProps {
  title: string
  error: string | { message: string }
  supportFormParams?: Partial<SupportFormUrlKeys>
  className?: string
}

export function ErrorMatcher({ title, error, supportFormParams, className }: ErrorMatcherProps) {
  const track = useTrack()

  const message = typeof error === 'string' ? error : error.message
  const mapping = ERROR_MAPPINGS.find((m) => m.pattern.test(message)) ?? null
  const supportUrl = createSupportFormUrl(supportFormParams ?? {})

  if (!mapping) {
    return (
      <ErrorDisplay
        title={title}
        errorMessage={message}
        supportUrl={supportUrl}
        className={className}
      />
    )
  }

  return (
    <ErrorDisplay
      title={title}
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
