import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ErrorMatcher } from './ErrorMatcher'

vi.mock('lib/telemetry/track', () => ({ useTrack: () => vi.fn() }))
vi.mock('state/ai-assistant-state', () => ({
  useAiAssistantStateSnapshot: () => ({ newChat: vi.fn() }),
}))
vi.mock('state/sidebar-manager-state', () => ({
  useSidebarManagerSnapshot: () => ({ openSidebar: vi.fn() }),
}))
vi.mock('components/layouts/ProjectLayout/LayoutSidebar/LayoutSidebarProvider', () => ({
  SIDEBAR_KEYS: { AI_ASSISTANT: 'ai-assistant' },
}))

describe('ErrorMatcher', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders matched error title and message', () => {
    render(
      <ErrorMatcher
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

  it('renders troubleshooting steps for matched errors', () => {
    render(
      <ErrorMatcher error="CONNECTION TERMINATED DUE TO CONNECTION TIMEOUT" supportUrl="/support" />
    )
    expect(screen.getByText('Try restarting your project')).toBeInTheDocument()
    expect(screen.getByText('Try our troubleshooting guide')).toBeInTheDocument()
    expect(screen.getByText('Debug with AI')).toBeInTheDocument()
  })

  it('renders fallback for unmatched errors', () => {
    render(<ErrorMatcher error="UNKNOWN ERROR" supportUrl="/support" />)
    expect(screen.getByText('An error occurred')).toBeInTheDocument()
    expect(screen.getByText('UNKNOWN ERROR')).toBeInTheDocument()
  })

  it('accepts error as object with message property', () => {
    render(<ErrorMatcher error={{ message: 'UNKNOWN ERROR' }} supportUrl="/support" />)
    expect(screen.getByText('UNKNOWN ERROR')).toBeInTheDocument()
  })

  it('renders support link with provided URL', () => {
    render(<ErrorMatcher error="UNKNOWN ERROR" supportUrl="/custom-support" />)
    expect(screen.getByRole('link', { name: /contact support/i })).toHaveAttribute(
      'href',
      '/custom-support'
    )
  })

  it('uses default support URL when not provided', () => {
    render(<ErrorMatcher error="UNKNOWN ERROR" />)
    expect(screen.getByRole('link', { name: /contact support/i })).toHaveAttribute(
      'href',
      '/support/new'
    )
  })
})
