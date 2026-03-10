---
name: studio-error-handling
description: Error display and troubleshooting pattern for Supabase Studio. Use when
  rendering API errors in the UI, adding inline troubleshooting steps for a new
  error type, or wiring up the AI assistant debug button from an error state.
---

# Studio Error Handling Pattern

Full docs: `apps/studio/components/interfaces/ErrorHandling/README.md`

## The pattern in one sentence

`<ErrorMatcher>` takes an API error message + a caller-supplied title, matches it against `ERROR_MAPPINGS`, and renders either a matched troubleshooting card or a generic error card.

## Key files

| File | Purpose |
| ---- | ------- |
| `ErrorMatcher.tsx` | Component — match + render |
| `error-mappings.tsx` | Array of `{ id, pattern, troubleshooting: <JSX> }` |
| `errorMappings/ConnectionTimeout.tsx` | Example troubleshooting component |
| `TroubleshootingSections.tsx` | Reusable accordion section components |
| `TroubleshootingAccordion.tsx` | Accordion wrapper with telemetry |

## Using ErrorMatcher

```tsx
import { ErrorMatcher } from 'components/interfaces/ErrorHandling/ErrorMatcher'

{isError && (
  <ErrorMatcher
    title="Failed to load indexes"   // set by the page — not the error type
    error={error.message}            // raw API error string
    supportFormParams={{ projectRef }} // typed, not a raw URL string
  />
)}
```

- **`title`** — always from the caller. The same error (e.g. connection timeout) shows different titles on different pages.
- **`supportFormParams`** — typed as `Partial<SupportFormUrlKeys>`. Never pass a raw URL. Available fields: `projectRef`, `orgSlug`, `category`, `subject`, `message`, `error`, `sid`.

## Adding a new error type

1. Create `errorMappings/YourError.tsx` — a self-contained component that uses `useAiAssistantStateSnapshot` + `useSidebarManagerSnapshot` directly (no props needed).
2. Add one entry to `error-mappings.tsx`: `{ id, pattern: /REGEX/i, troubleshooting: <YourErrorTroubleshooting /> }`.

See the README for the full template.

## What NOT to do

- Do not pass `supportUrl` as a raw string — use `supportFormParams`.
- Do not put the page title inside the error mapping — it belongs on the caller.
- Do not add callback props (`onDebugWithAI`, `onRestartProject`) to the troubleshooting component — use hooks inside it instead.
