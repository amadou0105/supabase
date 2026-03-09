import { render, screen } from '@testing-library/react'
import {
  AccordionContent_Shadcn_ as AccordionContent,
  AccordionItem_Shadcn_ as AccordionItem,
  AccordionTrigger_Shadcn_ as AccordionTrigger,
} from 'ui'
import { describe, expect, it, vi } from 'vitest'

import { TroubleshootingAccordion } from './TroubleshootingAccordion'

vi.mock('lib/telemetry/track', () => ({ useTrack: () => vi.fn() }))

function TestSteps() {
  return (
    <>
      <AccordionItem value="step-1" className="px-3 py-2">
        <AccordionTrigger>First step</AccordionTrigger>
        <AccordionContent>
          <p>First step description</p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="step-2" className="px-3 py-2">
        <AccordionTrigger>Second step</AccordionTrigger>
        <AccordionContent>
          <p>Second step description</p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="step-3" className="px-3 py-2">
        <AccordionTrigger>Third step</AccordionTrigger>
        <AccordionContent>
          <a href="https://example.com">Action 3</a>
        </AccordionContent>
      </AccordionItem>
    </>
  )
}

describe('TroubleshootingAccordion', () => {
  it('renders children', () => {
    render(
      <TroubleshootingAccordion errorType="test-error">
        <TestSteps />
      </TroubleshootingAccordion>
    )
    expect(screen.getByText('First step')).toBeInTheDocument()
    expect(screen.getByText('Second step')).toBeInTheDocument()
    expect(screen.getByText('Third step')).toBeInTheDocument()
  })

  it('expands first step by default', () => {
    render(
      <TroubleshootingAccordion errorType="test-error">
        <TestSteps />
      </TroubleshootingAccordion>
    )
    expect(screen.getByText('First step description')).toBeVisible()
  })

  it('respects custom defaultExpandedStep', () => {
    render(
      <TroubleshootingAccordion errorType="test-error" defaultExpandedStep={2}>
        <TestSteps />
      </TroubleshootingAccordion>
    )
    expect(screen.getByText('Second step description')).toBeVisible()
  })

  it('applies custom className', () => {
    const { container } = render(
      <TroubleshootingAccordion errorType="test-error" className="custom-class">
        <TestSteps />
      </TroubleshootingAccordion>
    )
    expect(container.querySelector('.custom-class')).toBeInTheDocument()
  })
})
