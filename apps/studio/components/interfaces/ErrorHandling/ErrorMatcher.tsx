'use client'

import { useTrack } from 'lib/telemetry/track'
import type { ClassifiedError } from 'types/api-errors'
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
  const errorType =
    typeof error === 'object' && 'errorType' in error
      ? (error as ClassifiedError).errorType
      : undefined
  const mapping = errorType ? (ERROR_MAPPINGS[errorType] ?? null) : null
  const Troubleshooting = mapping?.Troubleshooting

  return (
    <ErrorDisplay
      title={title}
      errorMessage={message}
      supportFormParams={supportFormParams}
      className={className}
      onRender={
        mapping ? () => track('inline_error_troubleshooter_shown', { errorType: mapping.id }) : undefined
      }
      onSupportClick={
        mapping
          ? () =>
              track('inline_error_troubleshooter_action_clicked', {
                errorType: mapping.id,
                action: 'contact_support',
              })
          : undefined
      }
    >
      {Troubleshooting && <Troubleshooting />}
    </ErrorDisplay>
  )
}
