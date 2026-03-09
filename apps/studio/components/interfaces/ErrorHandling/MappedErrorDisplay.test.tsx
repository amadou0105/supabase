import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { MappedErrorDisplay } from './MappedErrorDisplay'

// Mock the useTrack hook
vi.mock('lib/telemetry/track', () => ({
  useTrack: () => vi.fn(),
}))

describe('MappedErrorDisplay', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders error display with matched error', () => {
    render(
      <MappedErrorDisplay
        error="ERROR: FAILED TO RUN SQL QUERY: CONNECTION TERMINATED DUE TO CONNECTION TIMEOUT."
        supportUrl="/support"
      />
    )

    expect(screen.getByText('Failed to retrieve tables')).toBeInTheDocument()
    expect(
      screen.getByText(
        'ERROR: FAILED TO RUN SQL QUERY: CONNECTION TERMINATED DUE TO CONNECTION TIMEOUT.'
      )
    ).toBeInTheDocument()
  })

  it('renders fallback for unmatched errors', () => {
    render(<MappedErrorDisplay error="UNKNOWN ERROR" supportUrl="/support" />)

    expect(screen.getByText('An error occurred')).toBeInTheDocument()
    expect(screen.getByText('UNKNOWN ERROR')).toBeInTheDocument()
  })

  it('accepts error as string', () => {
    render(<MappedErrorDisplay error="CONNECTION TIMEOUT" supportUrl="/support" />)
    expect(screen.getByText('CONNECTION TIMEOUT')).toBeInTheDocument()
  })

  it('accepts error as object with message property', () => {
    render(<MappedErrorDisplay error={{ message: 'CONNECTION TIMEOUT' }} supportUrl="/support" />)
    expect(screen.getByText('CONNECTION TIMEOUT')).toBeInTheDocument()
  })

  it('renders troubleshooting steps for matched errors', () => {
    render(
      <MappedErrorDisplay
        error="CONNECTION TERMINATED DUE TO CONNECTION TIMEOUT"
        supportUrl="/support"
      />
    )

    expect(screen.getByText('Try restarting your project')).toBeInTheDocument()
    expect(screen.getByText('Try our troubleshooting guide')).toBeInTheDocument()
    expect(screen.getByText('Debug with AI')).toBeInTheDocument()
  })

  it('injects onRestartProject handler when provided', () => {
    const onRestartProject = vi.fn()

    render(
      <MappedErrorDisplay
        error="CONNECTION TIMEOUT"
        onRestartProject={onRestartProject}
        supportUrl="/support"
      />
    )

    const restartButton = screen.getByRole('button', { name: /restart project/i })
    expect(restartButton).toBeInTheDocument()
  })

  it('injects onDebugWithAI handler when provided', () => {
    const onDebugWithAI = vi.fn()

    render(
      <MappedErrorDisplay
        error="CONNECTION TIMEOUT"
        onDebugWithAI={onDebugWithAI}
        supportUrl="/support"
      />
    )

    const debugButton = screen.getByRole('button', { name: /debug with ai/i })
    expect(debugButton).toBeInTheDocument()
  })

  it('renders support link with provided URL', () => {
    render(<MappedErrorDisplay error="CONNECTION TIMEOUT" supportUrl="/custom-support" />)

    const supportLink = screen.getByRole('link', { name: /contact support/i })
    expect(supportLink).toHaveAttribute('href', '/custom-support')
  })

  it('applies custom className', () => {
    const { container } = render(
      <MappedErrorDisplay error="CONNECTION TIMEOUT" className="custom-class" />
    )
    expect(container.querySelector('.custom-class')).toBeInTheDocument()
  })

  it('uses default support URL when not provided', () => {
    render(<MappedErrorDisplay error="CONNECTION TIMEOUT" />)

    const supportLink = screen.getByRole('link', { name: /contact support/i })
    expect(supportLink).toHaveAttribute('href', '/support/new')
  })
})
