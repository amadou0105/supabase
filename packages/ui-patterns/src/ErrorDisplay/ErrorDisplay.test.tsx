import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ErrorDisplay } from './ErrorDisplay'

describe('ErrorDisplay', () => {
  const defaultProps = {
    title: 'Failed to retrieve tables',
    errorMessage: 'ERROR: CONNECTION TIMEOUT',
  }

  it('renders the title correctly', () => {
    render(<ErrorDisplay {...defaultProps} />)
    expect(screen.getByText('Failed to retrieve tables')).toBeInTheDocument()
  })

  it('renders the error message in a pre element', () => {
    render(<ErrorDisplay {...defaultProps} />)
    const errorElement = screen.getByText('ERROR: CONNECTION TIMEOUT')
    expect(errorElement).toBeInTheDocument()
    expect(errorElement.tagName).toBe('PRE')
  })

  it('renders support link when supportUrl is provided', () => {
    render(<ErrorDisplay {...defaultProps} supportUrl="https://supabase.com/support" />)
    const link = screen.getByRole('link', { name: /contact support/i })
    expect(link).toHaveAttribute('href', 'https://supabase.com/support')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('hides support link when supportUrl is not provided', () => {
    render(<ErrorDisplay {...defaultProps} />)
    expect(screen.queryByRole('link', { name: /contact support/i })).not.toBeInTheDocument()
  })

  it('renders children (troubleshooting steps)', () => {
    render(
      <ErrorDisplay {...defaultProps}>
        <div data-testid="troubleshooting">Step 1: Try this</div>
      </ErrorDisplay>
    )
    expect(screen.getByTestId('troubleshooting')).toBeInTheDocument()
  })

  it('has correct accessibility attributes', () => {
    render(<ErrorDisplay {...defaultProps} />)
    const alert = screen.getByRole('alert')
    expect(alert).toBeInTheDocument()
    expect(alert).toHaveAttribute('aria-labelledby', 'error-display-title')
  })

  it('applies custom className', () => {
    const { container } = render(<ErrorDisplay {...defaultProps} className="custom-class" />)
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('uses custom support label when provided', () => {
    render(
      <ErrorDisplay
        {...defaultProps}
        supportUrl="https://supabase.com/support"
        supportLabel="Get help"
      />
    )
    expect(screen.getByRole('link', { name: /get help/i })).toBeInTheDocument()
  })

  it('calls onRender callback when component mounts', () => {
    const onRender = vi.fn()
    render(<ErrorDisplay {...defaultProps} onRender={onRender} />)
    expect(onRender).toHaveBeenCalledTimes(1)
  })

  it('calls onRender callback only once on re-renders', () => {
    const onRender = vi.fn()
    const { rerender } = render(<ErrorDisplay {...defaultProps} onRender={onRender} />)
    rerender(<ErrorDisplay {...defaultProps} onRender={onRender} />)
    expect(onRender).toHaveBeenCalledTimes(1)
  })

  it('renders custom icon when provided', () => {
    render(<ErrorDisplay {...defaultProps} icon={<span data-testid="custom-icon">⚠️</span>} />)
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
  })

  it('displays error message with proper styling classes', () => {
    const { container } = render(<ErrorDisplay {...defaultProps} />)
    const errorMessageContainer = container.querySelector('pre')
    expect(errorMessageContainer).toHaveClass('font-mono')
    expect(errorMessageContainer).toHaveClass('text-xs')
  })
})
