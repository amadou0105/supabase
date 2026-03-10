import { TroubleshootingAccordion } from '../TroubleshootingAccordion'
import {
  FixWithAITroubleshootingSection,
  RestartDatabaseTroubleshootingSection,
  TroubleshootingGuideSection,
} from '../TroubleshootingSections'
import { ErrorMappingFactory } from './types'

interface ConnectionTimeoutProps {
  onRestartProject?: () => void
  onDebugWithAI?: (prompt: string) => void
}

const ERROR_TYPE = 'connection-timeout'

const BUILD_PROMPT = () =>
  `The user is encountering connection timeout errors. The error message is: "CONNECTION TERMINATED DUE TO CONNECTION TIMEOUT". What are the most likely causes of this issue and how can the user resolve it?`

function ConnectionTimeout({ onRestartProject, onDebugWithAI }: ConnectionTimeoutProps) {
  return (
    <TroubleshootingAccordion
      errorType={ERROR_TYPE}
      stepTitles={{
        1: 'Try restarting your project',
        2: 'Try our troubleshooting guide',
        3: 'Debug with AI',
      }}
    >
      <RestartDatabaseTroubleshootingSection
        number={1}
        errorType={ERROR_TYPE}
        onRestartProject={onRestartProject}
      />
      <TroubleshootingGuideSection
        number={2}
        errorType={ERROR_TYPE}
        href="https://supabase.com/docs/guides/troubleshooting/failed-to-run-sql-query-connection-terminated-due-to-connection-timeout"
        description="Follow step-by-step instructions for diagnosing connection timeout issues."
      />
      <FixWithAITroubleshootingSection
        number={3}
        errorType={ERROR_TYPE}
        onDebugWithAI={onDebugWithAI}
        buildPrompt={BUILD_PROMPT}
      />
    </TroubleshootingAccordion>
  )
}

export const connectionTimeoutMapping: ErrorMappingFactory = (params) => ({
  id: ERROR_TYPE,
  pattern: /CONNECTION\s+TERMINATED\s+DUE\s+TO\s+CONNECTION\s+TIMEOUT/i,
  title: 'Failed to retrieve tables',
  priority: 10,
  content: (
    <ConnectionTimeout
      onRestartProject={params?.onRestartProject}
      onDebugWithAI={params?.onDebugWithAI}
    />
  ),
})
