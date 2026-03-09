'use client'

import { forwardRef, useEffect, useRef } from 'react'
import { AlertTriangle, HelpCircle } from 'lucide-react'
import { cn } from 'ui'
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
      <div
        ref={ref}
        className={cn(
          'rounded-lg border border-destructive-400 bg-surface-100 overflow-hidden',
          className
        )}
        role="alert"
        aria-labelledby="error-display-title"
        {...props}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-default bg-surface-75">
          <div className="flex-shrink-0 text-warning-600">
            {icon ?? <AlertTriangle className="h-5 w-5" />}
          </div>
          <h3 id="error-display-title" className="text-sm font-medium text-foreground">
            {title}
          </h3>
        </div>

        {/* Error Message Display */}
        <div className="px-5 py-3.5 bg-warning-200 border-b border-warning-400">
          <pre className="text-xs font-mono text-warning-600 whitespace-pre-wrap break-words overflow-auto max-h-32">
            {errorMessage}
          </pre>
        </div>

        {/* Troubleshooting Steps (Children) */}
        {children && <div className="px-5 py-4 bg-surface-100">{children}</div>}

        {/* Footer */}
        {supportUrl && (
          <div className="px-5 py-3 border-t border-default bg-surface-75 flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-foreground-muted" />
            <span className="text-sm text-foreground-light">Still need further help?</span>
            <a
              href={supportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-foreground underline hover:text-foreground-light transition-colors"
            >
              {supportLabel}
            </a>
          </div>
        )}
      </div>
    )
  }
)

ErrorDisplay.displayName = 'ErrorDisplay'
