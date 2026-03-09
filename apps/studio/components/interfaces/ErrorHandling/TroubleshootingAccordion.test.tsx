import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { TroubleshootingAccordion } from './TroubleshootingAccordion'
import type { TroubleshootingStepConfig } from './ErrorMatcher.types'

describe('TroubleshootingAccordion', () => {
  const mockSteps: TroubleshootingStepConfig[] = [
    {
      number: 1,
      title: 'First step',
      description: 'First step description',
      actions: [{ label: 'Action 1', onClick: vi.fn() }],
    },
    {
      number: 2,
      title: 'Second step',
      description: 'Second step description',
      actions: [],
    },
    {
      number: 3,
      title: 'Third step',
      actions: [{ label: 'Action 3', href: 'https://example.com' }],
    },
  ]

  it('renders all steps', () => {
    render(<TroubleshootingAccordion steps={mockSteps} />)
    expect(screen.getByText('First step')).toBeInTheDocument()
    expect(screen.getByText('Second step')).toBeInTheDocument()
    expect(screen.getByText('Third step')).toBeInTheDocument()
  })

  it('expands first step by default', () => {
    render(<TroubleshootingAccordion steps={mockSteps} />)
    expect(screen.getByText('First step description')).toBeVisible()
  })

  it('respects custom defaultExpandedStep', () => {
    render(<TroubleshootingAccordion steps={mockSteps} defaultExpandedStep={2} />)
    expect(screen.getByText('Second step description')).toBeVisible()
  })

  it('calls onStepExpand when a step is expanded', async () => {
    const onStepExpand = vi.fn()
    const user = userEvent.setup()

    render(<TroubleshootingAccordion steps={mockSteps} onStepExpand={onStepExpand} />)

    const secondStepTrigger = screen.getByText('Second step')
    await user.click(secondStepTrigger)

    expect(onStepExpand).toHaveBeenCalledWith(2)
  })

  it('calls onActionClick when an action button is clicked', async () => {
    const onActionClick = vi.fn()
    const user = userEvent.setup()

    render(<TroubleshootingAccordion steps={mockSteps} onActionClick={onActionClick} />)

    const actionButton = screen.getByRole('button', { name: 'Action 1' })
    await user.click(actionButton)

    expect(onActionClick).toHaveBeenCalledWith(1, 'Action 1')
  })

  it('renders step numbers correctly', () => {
    render(<TroubleshootingAccordion steps={mockSteps} />)
    const stepNumbers = screen.getAllByText(/^[1-3]$/)
    expect(stepNumbers).toHaveLength(6) // 3 in triggers + 3 in content
  })

  it('applies custom className', () => {
    const { container } = render(
      <TroubleshootingAccordion steps={mockSteps} className="custom-class" />
    )
    expect(container.querySelector('.custom-class')).toBeInTheDocument()
  })
})
