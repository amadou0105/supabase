'use client'

import { useTrack } from 'lib/telemetry/track'
import { ReactNode } from 'react'
import { Accordion_Shadcn_ as Accordion, cn } from 'ui'

interface TroubleshootingAccordionProps {
  children: ReactNode
  /** Error mapping ID — used for telemetry */
  errorType: string
  /** Which step to expand by default (1-indexed), defaults to 1 */
  defaultExpandedStep?: number
  className?: string
}

export function TroubleshootingAccordion({
  children,
  errorType,
  defaultExpandedStep = 1,
  className,
}: TroubleshootingAccordionProps) {
  const track = useTrack()
  const defaultValue = defaultExpandedStep > 0 ? `step-${defaultExpandedStep}` : undefined

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={defaultValue}
      className={cn('w-full', className)}
      onValueChange={(value) => {
        track('inline_error_troubleshooter_accordion_toggled', {
          error_type: errorType,
          expanded: Boolean(value),
        })
      }}
    >
      {children}
    </Accordion>
  )
}
