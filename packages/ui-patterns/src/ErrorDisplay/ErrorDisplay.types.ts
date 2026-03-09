import { ComponentPropsWithoutRef, ReactNode } from 'react'

export interface ErrorDisplayProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * Title displayed in the header with warning icon
   * @example "Failed to retrieve tables"
   */
  title: string

  /**
   * Error message displayed in monospace code block style
   * @example "ERROR: FAILED TO RUN SQL QUERY: CONNECTION TERMINATED DUE TO CONNECTION TIMEOUT."
   */
  errorMessage: string

  /**
   * URL for the "Contact support" link in the footer
   * @default undefined - hides the support link if not provided
   */
  supportUrl?: string

  /**
   * Text for the support link
   * @default "Contact support"
   */
  supportLabel?: string

  /**
   * Children slot for accordion-style troubleshooting steps
   * Typically contains TroubleshootingAccordion or similar content
   */
  children?: ReactNode

  /**
   * Additional CSS classes for the root container
   */
  className?: string

  /**
   * Custom icon to display in the header
   * @default AlertTriangle from lucide-react
   */
  icon?: ReactNode

  /**
   * Callback fired when the component is rendered
   * Useful for tracking error display events
   */
  onRender?: () => void
}
