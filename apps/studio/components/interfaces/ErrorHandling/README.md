# Error Handling

`ErrorMatcher` matches an API error message against known patterns. If matched, it shows the relevant troubleshooting steps. If not, it shows a generic error. The `title` always comes from the caller — the same error pattern can appear on different pages with different titles.

## Usage

```tsx
import { ErrorMatcher } from 'components/interfaces/ErrorHandling/ErrorMatcher'

{isError && (
  <ErrorMatcher
    title="Failed to load tables"
    error={error.message}
    supportUrl={`/support/new?project=${projectRef}`}
  />
)}
```

## Adding a new error mapping

**1. Create `errorMappings/YourError.tsx`**

```tsx
import { SIDEBAR_KEYS } from 'components/layouts/ProjectLayout/LayoutSidebar/LayoutSidebarProvider'
import { useAiAssistantStateSnapshot } from 'state/ai-assistant-state'
import { useSidebarManagerSnapshot } from 'state/sidebar-manager-state'

import { TroubleshootingAccordion } from '../TroubleshootingAccordion'
import { FixWithAITroubleshootingSection, TroubleshootingGuideSection } from '../TroubleshootingSections'

const ERROR_TYPE = 'your-error'
const BUILD_PROMPT = () => `Describe the issue for the AI assistant.`

export function YourErrorTroubleshooting() {
  const { openSidebar } = useSidebarManagerSnapshot()
  const aiSnap = useAiAssistantStateSnapshot()

  return (
    <TroubleshootingAccordion errorType={ERROR_TYPE} stepTitles={{ 1: 'Troubleshooting guide', 2: 'Debug with AI' }}>
      <TroubleshootingGuideSection number={1} errorType={ERROR_TYPE} href="https://supabase.com/docs/guides/..." />
      <FixWithAITroubleshootingSection
        number={2}
        errorType={ERROR_TYPE}
        buildPrompt={BUILD_PROMPT}
        onDebugWithAI={(prompt) => {
          openSidebar(SIDEBAR_KEYS.AI_ASSISTANT)
          aiSnap.newChat({ initialMessage: prompt })
        }}
      />
    </TroubleshootingAccordion>
  )
}
```

**2. Add it to `error-mappings.tsx`**

```tsx
import { YourErrorTroubleshooting } from './errorMappings/YourError'

export const ERROR_MAPPINGS: ErrorMapping[] = [
  // existing...
  {
    id: 'your-error',
    pattern: /YOUR_ERROR_PATTERN/i,
    troubleshooting: <YourErrorTroubleshooting />,
  },
]
```

That's it. `ErrorMatcher` picks it up automatically.

## Available section components

| Component                               | Props                                                   |
| --------------------------------------- | ------------------------------------------------------- |
| `RestartDatabaseTroubleshootingSection` | `number`, `errorType`, `onRestartProject?`              |
| `TroubleshootingGuideSection`           | `number`, `errorType`, `href`, `title?`, `description?` |
| `FixWithAITroubleshootingSection`       | `number`, `errorType`, `buildPrompt`, `onDebugWithAI?`  |
