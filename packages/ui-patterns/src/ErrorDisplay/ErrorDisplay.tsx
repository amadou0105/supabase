'use client'

import { AlertTriangle, HelpCircle } from 'lucide-react'
import { forwardRef, useEffect, useRef } from 'react'
import { Card, CardHeader, cn } from 'ui'

import type { ErrorDisplayProps } from './ErrorDisplay.types'

const WarningIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 22 20"
    className="w-3 h-3"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.15137 1.95117C9.30615 -0.0488281 12.1943 -0.0488281 13.3481 1.95117L20.7031 14.6992C21.8574 16.6992 20.4131 19.1992 18.104 19.1992H3.39502C1.08594 19.1992 -0.356933 16.6992 0.797364 14.6992L8.15137 1.95117ZM11.7666 16.0083C11.4971 16.2778 11.1313 16.4292 10.75 16.4292C10.3687 16.4292 10.0029 16.2778 9.7334 16.0083C9.46387 15.7388 9.3125 15.373 9.3125 14.9917C9.3125 14.9307 9.31641 14.8706 9.32373 14.811C9.33545 14.7197 9.35547 14.6304 9.38379 14.5439L9.41406 14.4609C9.48584 14.2803 9.59375 14.1147 9.7334 13.9751C10.0029 13.7056 10.3687 13.5542 10.75 13.5542C11.1313 13.5542 11.4971 13.7056 11.7666 13.9751C12.0361 14.2446 12.1875 14.6104 12.1875 14.9917C12.1875 15.373 12.0361 15.7388 11.7666 16.0083ZM10.75 4.69971C11.0317 4.69971 11.3022 4.81152 11.5015 5.01074C11.7007 5.20996 11.8125 5.48047 11.8125 5.76221V11.0747C11.8125 11.3564 11.7007 11.627 11.5015 11.8262C11.3022 12.0254 11.0317 12.1372 10.75 12.1372C10.4683 12.1372 10.1978 12.0254 9.99854 11.8262C9.79932 11.627 9.6875 11.3564 9.6875 11.0747V5.76221C9.6875 5.48047 9.79932 5.20996 9.99854 5.01074C10.1978 4.81152 10.4683 4.69971 10.75 4.69971Z"
    />
  </svg>
)

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
      onSupportClick,
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
        <CardHeader className="flex-row items-center gap-2.5 space-y-0 py-2 px-3">
          <div className="bg-warning p-1 text-background rounded-md">{icon ?? <WarningIcon />}</div>
          <h3 id="error-display-title" className="text-sm text-foreground mt-0">
            {title}
          </h3>
        </CardHeader>

        {/* Error Message Display */}
        <div className="px-4 py-3 bg-warning-200 border-y border-warning-500">
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
              onClick={onSupportClick}
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
