'use client'

import { AlertTriangle, HelpCircle } from 'lucide-react'
import { forwardRef, useEffect, useRef } from 'react'
import { Card, CardHeader, cn } from 'ui'

import type { ErrorDisplayProps } from './ErrorDisplay.types'

/**
 * ErrorDisplay component for displaying error messages with troubleshooting steps.
 *
 * This component provides a structured way to show errors with:
 * - A header with warning icon and title
 * - A monospace error message display area
 * - A children slot for accordion-style troubleshooting steps
 * - A footer with a support link
 *
 * @example
 * ```tsx
 * <ErrorDisplay
 *   title="Failed to retrieve tables"
 *   errorMessage="ERROR: CONNECTION TIMEOUT"
 *   supportUrl="https://supabase.com/support"
 * >
 *   <TroubleshootingAccordion steps={troubleshootingSteps} />
 * </ErrorDisplay>
 * ```
 */
export const ErrorDisplay = forwardRef<HTMLDivElement, ErrorDisplayProps>(
  (
    {
      title,
      errorMessage,
      supportUrl,
      supportLabel = 'Contact support',
      children,
      className,
      icon,
      onRender,
      ...props
    },
    ref
  ) => {
    const hasTrackedRenderRef = useRef(false)

    useEffect(() => {
      if (!hasTrackedRenderRef.current && onRender) {
        hasTrackedRenderRef.current = true
        onRender()
      }
    }, [onRender])

    return (
      <Card
        ref={ref}
        className={cn('rounded-lg border border-default', className)}
        role="alert"
        aria-labelledby="error-display-title"
        {...props}
      >
        {/* Header */}
        <CardHeader className="flex-row items-center gap-4 space-y-0 py-2">
          <div className="text-warning-600">{icon ?? <AlertTriangle className="h-4 w-4" />}</div>
          <h3 id="error-display-title" className="text-sm text-foreground mt-0">
            {title}
          </h3>
        </CardHeader>

        {/* Error Message Display */}
        <div className="px-5 py-3.5 bg-warning-200 border-b border-warning-400">
          <pre className="text-xs font-mono text-warning-600 whitespace-pre-wrap break-words overflow-auto max-h-32">
            {errorMessage}
          </pre>
        </div>

        {/* Troubleshooting Steps (Children) */}
        {children && <div>{children}</div>}

        {/* Footer */}
        {supportUrl && (
          <div className="px-3 py-2 border-t border-default flex items-center gap-2">
            <div className="flex-shrink-0">
              <HelpCircle className="h-4 w-4 text-foreground-muted" />
            </div>
            <span className="text-sm text-foreground-light">Need help?</span>
            <a
              href={supportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-foreground flex-shrink-0 underline hover:text-foreground-light transition-colors"
            >
              {supportLabel}
            </a>
          </div>
        )}
      </Card>
    )
  }
)

ErrorDisplay.displayName = 'ErrorDisplay'
