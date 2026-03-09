import { ErrorMappingFactory } from './types'

export const connectionTimeoutMapping: ErrorMappingFactory = (params) => ({
  id: 'connection-timeout',
  pattern: /CONNECTION\s+TERMINATED\s+DUE\s+TO\s+CONNECTION\s+TIMEOUT/i,
  title: 'Failed to retrieve tables',
  priority: 10,
  steps: [
    {
      number: 1,
      title: 'Try restarting your project',
      description:
        'Restarting your project can help resolve timeout errors or stale connections.',
      actions: params?.onRestartProject
        ? [
            {
              label: 'Restart project',
              onClick: params.onRestartProject,
              variant: 'default',
            },
          ]
        : [],
    },
    {
      number: 2,
      title: 'Try our troubleshooting guide',
      description: 'Follow step-by-step instructions for diagnosing connection timeout issues.',
      actions: [
        {
          label: 'View troubleshooting guide',
          href: 'https://supabase.com/docs/guides/platform/troubleshooting#connection-timeout',
          variant: 'default',
        },
      ],
    },
    {
      number: 3,
      title: 'Debug with AI',
      description:
        'Let our AI assistant help diagnose and suggest solutions for your connection issues.',
      actions: params?.onDebugWithAI
        ? [
            {
              label: 'Debug with AI',
              onClick: params.onDebugWithAI,
              variant: 'primary',
            },
          ]
        : [],
    },
  ],
})
