import { TroubleshootingAccordion } from '../TroubleshootingAccordion'
import {
  FixWithAITroubleshootingSection,
  RestartDatabaseTroubleshootingSection,
  TroubleshootingGuideSection,
} from '../TroubleshootingSections'
import { ErrorMappingFactory } from './types'

interface ConnectionTimeoutProps {
  onRestartProject?: () => void
  onDebugWithAI?: () => void
  buildPrompt?: () => string
}

function ConnectionTimeout({
  onRestartProject,
  onDebugWithAI,
  buildPrompt,
}: ConnectionTimeoutProps) {
  return (
    <TroubleshootingAccordion>
      <RestartDatabaseTroubleshootingSection number={1} onRestartProject={onRestartProject} />
      <TroubleshootingGuideSection
        number={2}
        href="https://supabase.com/docs/guides/platform/troubleshooting#connection-timeout"
        description="Follow step-by-step instructions for diagnosing connection timeout issues."
      />
      <FixWithAITroubleshootingSection
        number={3}
        onDebugWithAI={onDebugWithAI}
        buildPrompt={buildPrompt}
      />
    </TroubleshootingAccordion>
  )
}

export const connectionTimeoutMapping: ErrorMappingFactory = (params) => ({
  id: 'connection-timeout',
  pattern: /CONNECTION\s+TERMINATED\s+DUE\s+TO\s+CONNECTION\s+TIMEOUT/i,
  title: 'Failed to retrieve tables',
  priority: 10,
  content: (
    <ConnectionTimeout
      onRestartProject={params?.onRestartProject}
      onDebugWithAI={params?.onDebugWithAI}
      buildPrompt={params?.buildPrompt}
    />
  ),
})
