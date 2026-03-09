# Error Handling Components

This directory contains a reusable error display system that automatically matches error messages to user-friendly troubleshooting UI with PostHog event tracking.

## Components

### `MappedErrorDisplay`

The main component that automatically matches error messages to troubleshooting steps.

**Features:**
- Pattern matching against registered error types
- Automatic troubleshooting step injection
- PostHog event tracking (10% sampled):
  - Error display events
  - Accordion step expansion
  - Action button clicks
- Fallback UI for unmatched errors
- Theme-aware (light/dark mode)

**Usage:**

```tsx
import { MappedErrorDisplay } from 'components/interfaces/ErrorHandling'

function MyComponent() {
  const handleRestartProject = () => {
    // Your restart logic
  }

  const handleDebugWithAI = () => {
    // Your AI debug logic
  }

  return (
    <MappedErrorDisplay
      error="ERROR: FAILED TO RUN SQL QUERY: CONNECTION TERMINATED DUE TO CONNECTION TIMEOUT."
      projectRef={projectRef}
      onRestartProject={handleRestartProject}
      onDebugWithAI={handleDebugWithAI}
      supportUrl="/support/new"
    />
  )
}
```

### `ErrorDisplay` (from ui-patterns)

Lower-level component for displaying errors with custom content. Use this when you need full control over the troubleshooting steps.

```tsx
import { ErrorDisplay } from 'ui-patterns/ErrorDisplay'
import { TroubleshootingAccordion } from 'components/interfaces/ErrorHandling'

function CustomErrorDisplay() {
  const customSteps = [
    {
      number: 1,
      title: 'Check your configuration',
      description: 'Verify settings are correct',
      actions: [
        { label: 'View settings', href: '/settings' }
      ]
    }
  ]

  return (
    <ErrorDisplay
      title="Configuration error"
      errorMessage="Invalid configuration detected"
      supportUrl="/support"
    >
      <TroubleshootingAccordion steps={customSteps} />
    </ErrorDisplay>
  )
}
```

## Adding New Error Mappings

To add a new error type with specific troubleshooting steps:

### 1. Create a new mapping file

Create a new file in `errorMappings/`:

```tsx
// errorMappings/databaseFull.tsx
import { ErrorMappingFactory } from './types'

export const databaseFullMapping: ErrorMappingFactory = (params) => ({
  id: 'database-full',
  pattern: /DISK\s+FULL|STORAGE\s+EXCEEDED/i,
  title: 'Database storage limit reached',
  priority: 10,
  steps: [
    {
      number: 1,
      title: 'Review your storage usage',
      description: 'Check which tables are using the most space.',
      actions: [
        {
          label: 'View storage report',
          href: `/project/${params?.projectRef}/reports/database`,
          variant: 'default',
        },
      ],
    },
    {
      number: 2,
      title: 'Upgrade your plan',
      description: 'Increase your storage limit by upgrading your subscription.',
      actions: [
        {
          label: 'View plans',
          href: `/org/${params?.orgRef}/billing`,
          variant: 'primary',
        },
      ],
    },
  ],
})
```

### 2. Register the mapping

Add it to `errorMappings/index.ts`:

```tsx
import { databaseFullMapping } from './databaseFull'

export const allErrorMappings: ErrorMapping[] = [
  connectionTimeoutMapping(),
  databaseFullMapping(),
  // ... other mappings
]

export { databaseFullMapping }
```

That's it! The new error pattern will now be automatically matched when displayed with `MappedErrorDisplay`.

## Error Mapping Configuration

### Pattern Matching

Patterns can be either strings or regular expressions:

```tsx
// String pattern (case-insensitive substring match)
pattern: 'CONNECTION TIMEOUT'

// Regex pattern (with capture groups if needed)
pattern: /ERROR:\s+(?<code>\d+)/i
```

### Priority

Higher priority patterns are matched first:

```tsx
priority: 10  // High priority
priority: 5   // Medium priority
priority: 1   // Low priority
```

### Actions

Each troubleshooting step can have multiple actions:

```tsx
actions: [
  {
    label: 'Restart project',
    onClick: params?.onRestartProject,  // Callback function
    variant: 'default',
  },
  {
    label: 'View documentation',
    href: 'https://supabase.com/docs',  // External link
    variant: 'default',
  },
]
```

**Action variants:**
- `'default'` - Standard button
- `'primary'` - Primary/accent button
- `'destructive'` - Destructive/danger button

## PostHog Event Tracking

The component automatically tracks the following events:

### `dashboard_error_created`

Triggered when an error is displayed (10% sampled).

**Properties:**
- `source: 'error_display'`
- `error_type: string` - ID of the matched error mapping
- `has_troubleshooting: boolean` - Whether troubleshooting steps were available

### `error_troubleshooting_step_expanded`

Triggered when a user expands a troubleshooting step.

**Properties:**
- `step_number: number` - Which step was expanded (1, 2, 3, etc.)
- `error_type: string` - ID of the error mapping

### `error_troubleshooting_action_clicked`

Triggered when a user clicks an action button.

**Properties:**
- `step_number: number` - Which step contains the action
- `action_label: string` - Label of the clicked button
- `error_type: string` - ID of the error mapping

## Testing

Tests are located in:
- `ErrorMatcher.test.ts` - Pattern matching logic
- `TroubleshootingAccordion.test.tsx` - Accordion component
- `MappedErrorDisplay.test.tsx` - Main component integration

Run tests:

```bash
cd apps/studio
pnpm test ErrorHandling
```

## Architecture

```
ErrorHandling/
├── index.ts                       # Public exports
├── README.md                      # This file
│
├── ErrorMatcher.ts                # Pattern matching utility
├── ErrorMatcher.types.ts          # TypeScript definitions
├── ErrorMatcher.test.ts           # Matcher tests
│
├── MappedErrorDisplay.tsx         # Main wrapper component
├── MappedErrorDisplay.test.tsx    # Integration tests
├── TroubleshootingAccordion.tsx   # Accordion UI
├── TroubleshootingAccordion.test.tsx
├── TroubleshootingStep.tsx        # Individual step UI
│
└── errorMappings/
    ├── index.ts                   # Mapping registry
    ├── types.ts                   # Shared types
    └── connectionTimeout.tsx      # Example mapping
```

## UI/UX Guidelines

- **First step expanded by default**: Makes it easy for users to start troubleshooting
- **Monospace error messages**: Technical errors are easier to read in code format
- **Support link always visible**: Users can always escalate to support
- **Progressive disclosure**: Steps are collapsed to avoid overwhelming users
- **Action-oriented**: Each step has clear next actions
