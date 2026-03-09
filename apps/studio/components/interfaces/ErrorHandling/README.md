# Error Handling

`MappedErrorDisplay` matches error messages to troubleshooting UI. Unmatched errors fall back to a generic error display.

## Usage

```tsx
import { MappedErrorDisplay } from 'components/interfaces/ErrorHandling'
;<MappedErrorDisplay
  error={error.message}
  onRestartProject={handleRestart}
  onDebugWithAI={openAIAssistant}
  supportUrl={`/support/new?project=${projectRef}`}
/>
```

## Adding a new error mapping

**1. Create `errorMappings/YourError.tsx`**

```tsx
import { TroubleshootingAccordion } from '../TroubleshootingAccordion'
import {
  FixWithAITroubleshootingSection,
  TroubleshootingGuideSection,
} from '../TroubleshootingSections'
import { ErrorMappingFactory } from './types'

function YourError({ onDebugWithAI }: { onDebugWithAI?: () => void }) {
  return (
    <TroubleshootingAccordion>
      <TroubleshootingGuideSection
        number={1}
        href="https://supabase.com/docs/guides/..."
        description="Step-by-step instructions for this error."
      />
      <FixWithAITroubleshootingSection number={2} onDebugWithAI={onDebugWithAI} />
    </TroubleshootingAccordion>
  )
}

export const yourErrorMapping: ErrorMappingFactory = (params) => ({
  id: 'your-error',
  pattern: /YOUR_ERROR_PATTERN/i,
  title: 'Human-readable error title',
  priority: 10,
  content: <YourError onDebugWithAI={params?.onDebugWithAI} />,
})
```

**2. Register it in `errorMappings/index.ts`**

```ts
import { yourErrorMapping } from './YourError'

export const allMappingFactories: ErrorMappingFactory[] = [
  connectionTimeoutMapping,
  yourErrorMapping, // add here
]
```

That's it. The new pattern will be matched automatically.

## Available section components

| Component                               | Props                                      |
| --------------------------------------- | ------------------------------------------ |
| `RestartDatabaseTroubleshootingSection` | `number`, `onRestartProject?`              |
| `TroubleshootingGuideSection`           | `number`, `href`, `title?`, `description?` |
| `FixWithAITroubleshootingSection`       | `number`, `onDebugWithAI?`, `buildPrompt?` |
