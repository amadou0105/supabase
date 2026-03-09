'use client'

import { ReactNode } from 'react'
import { Accordion_Shadcn_ as Accordion, cn } from 'ui'

interface TroubleshootingAccordionProps {
  children: ReactNode
  /** Which step to expand by default (1-indexed), defaults to 1 */
  defaultExpandedStep?: number
  className?: string
}

export function TroubleshootingAccordion({
  children,
  defaultExpandedStep = 1,
  className,
}: TroubleshootingAccordionProps) {
  const defaultValue = defaultExpandedStep > 0 ? `step-${defaultExpandedStep}` : undefined

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={defaultValue}
      className={cn('w-full', className)}
    >
      {children}
    </Accordion>
  )
}
