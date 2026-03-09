'use client'

import {
  Accordion_Shadcn_ as Accordion,
  AccordionContent_Shadcn_ as AccordionContent,
  AccordionItem_Shadcn_ as AccordionItem,
  AccordionTrigger_Shadcn_ as AccordionTrigger,
  cn,
} from 'ui'
import type { TroubleshootingStepConfig } from './ErrorMatcher.types'
import { TroubleshootingStep } from './TroubleshootingStep'

interface TroubleshootingAccordionProps {
  steps: TroubleshootingStepConfig[]
  /** Which step to expand by default (1-indexed), defaults to 1 */
  defaultExpandedStep?: number
  className?: string
  /** Callback when a step is expanded */
  onStepExpand?: (stepNumber: number) => void
  /** Callback when an action button is clicked */
  onActionClick?: (stepNumber: number, actionLabel: string) => void
}

export function TroubleshootingAccordion({
  steps,
  defaultExpandedStep = 1,
  className,
  onStepExpand,
  onActionClick,
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
      {steps.map((step) => (
        <AccordionItem
          key={step.number}
          value={`step-${step.number}`}
          className="border-b border-default last:border-b-0"
        >
          <AccordionTrigger className="py-3 hover:no-underline">
            <div className="flex items-center gap-2.5">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-foreground text-background text-xs font-medium flex items-center justify-center">
                {step.number}
              </span>
              <span className="text-sm font-medium text-foreground text-left">{step.title}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 pt-1">
            <TroubleshootingStep
              {...step}
              className="pl-7"
              onActionClick={(actionLabel) => onActionClick?.(step.number, actionLabel)}
            />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
