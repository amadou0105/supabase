import { ErrorDisplay } from 'ui-patterns/ErrorDisplay'

export default function ErrorDisplayNoSupport() {
  return (
    <ErrorDisplay
      title="Failed to load tables"
      errorMessage="ERROR: FAILED TO RUN SQL QUERY: CONNECTION TERMINATED DUE TO CONNECTION TIMEOUT."
    />
  )
}
