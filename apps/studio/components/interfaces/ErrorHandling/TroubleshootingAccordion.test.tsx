import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import {
  AccordionContent_Shadcn_ as AccordionContent,
  AccordionItem_Shadcn_ as AccordionItem,
  AccordionTrigger_Shadcn_ as AccordionTrigger,
} from 'ui'
import { TroubleshootingAccordion } from './TroubleshootingAccordion'

function TestSteps({ onActionClick }: { onActionClick?: (label: string) => void }) {
  return (
    <>
      <AccordionItem value="step-1" className="px-3 py-2">
        <AccordionTrigger>First step</AccordionTrigger>
        <AccordionContent>
          <p>First step description</p>
          <button onClick={() => onActionClick?.('Action 1')}>Action 1</button>
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
      <TroubleshootingAccordion>
        <TestSteps />
      </TroubleshootingAccordion>
    )
    expect(screen.getByText('First step')).toBeInTheDocument()
    expect(screen.getByText('Second step')).toBeInTheDocument()
    expect(screen.getByText('Third step')).toBeInTheDocument()
  })

  it('expands first step by default', () => {
    render(
      <TroubleshootingAccordion>
        <TestSteps />
      </TroubleshootingAccordion>
    )
    expect(screen.getByText('First step description')).toBeVisible()
  })

  it('respects custom defaultExpandedStep', () => {
    render(
      <TroubleshootingAccordion defaultExpandedStep={2}>
        <TestSteps />
      </TroubleshootingAccordion>
    )
    expect(screen.getByText('Second step description')).toBeVisible()
  })

  it('calls onStepExpand when a step is expanded', async () => {
    const onStepExpand = vi.fn()
    const user = userEvent.setup()

    render(
      <TroubleshootingAccordion onStepExpand={onStepExpand}>
        <TestSteps />
      </TroubleshootingAccordion>
    )

    const secondStepTrigger = screen.getByText('Second step')
    await user.click(secondStepTrigger)

    expect(onStepExpand).toHaveBeenCalledWith(2)
  })

  it('applies custom className', () => {
    const { container } = render(
      <TroubleshootingAccordion className="custom-class">
        <TestSteps />
      </TroubleshootingAccordion>
    )
    expect(container.querySelector('.custom-class')).toBeInTheDocument()
  })
})
