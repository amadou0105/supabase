'use client'

import { ReactNode } from 'react'
import { Accordion_Shadcn_ as Accordion, cn } from 'ui'

interface TroubleshootingAccordionProps {
  children: ReactNode
  /** Which step to expand by default (1-indexed), defaults to 1 */
  defaultExpandedStep?: number
  className?: string
  /** Callback when a step is expanded */
  onStepExpand?: (stepNumber: number) => void
}

export function TroubleshootingAccordion({
  children,
  defaultExpandedStep = 1,
  className,
  onStepExpand,
}: TroubleshootingAccordionProps) {
  const defaultValue = defaultExpandedStep > 0 ? `step-${defaultExpandedStep}` : undefined

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={defaultValue}
      className={cn('w-full', className)}
      onValueChange={(value) => {
        if (value && onStepExpand) {
          const stepNumber = parseInt(value.replace('step-', ''), 10)
          onStepExpand(stepNumber)
        }
      }}
    >
      {children}
    </Accordion>
  )
}
