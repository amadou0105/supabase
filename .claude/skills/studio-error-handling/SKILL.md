---
name: studio-error-handling
description: Error display and troubleshooting pattern for Supabase Studio. Use when
  rendering API errors in the UI, adding inline troubleshooting steps for a new
  error type, or wiring up the AI assistant debug button from an error state.
---

# Studio Error Handling Pattern

Full docs and code examples: `apps/studio/components/interfaces/ErrorHandling/README.md`

## Key files

| File                                  | Purpose                                            |
| ------------------------------------- | -------------------------------------------------- |
| `ErrorMatcher.tsx`                    | Component — match error message + render           |
| `error-mappings.tsx`                  | Array of `{ id, pattern, troubleshooting: <JSX> }` |
| `errorMappings/ConnectionTimeout.tsx` | Reference troubleshooting component                |
| `TroubleshootingSections.tsx`         | Reusable accordion section components              |
| `TroubleshootingAccordion.tsx`        | Accordion wrapper with telemetry                   |

## What NOT to do

- Do not pass a raw URL string for support — use `supportFormParams={{ projectRef }}`.
- Do not put the page title inside the error mapping — it belongs on the `<ErrorMatcher>` caller.
- Do not add callback props (`onDebugWithAI`, `onRestartProject`) to troubleshooting components — use hooks inside them instead.
