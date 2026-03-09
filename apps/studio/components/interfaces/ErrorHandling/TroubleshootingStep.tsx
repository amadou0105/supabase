import { ExternalLink } from 'lucide-react'
import { Button, cn } from 'ui'
import type { TroubleshootingStepConfig } from './ErrorMatcher.types'

interface TroubleshootingStepProps extends TroubleshootingStepConfig {
  className?: string
  onActionClick?: (actionLabel: string) => void
}

export function TroubleshootingStep({
  number,
  title,
  description,
  actions,
  className,
  onActionClick,
}: TroubleshootingStepProps) {
  return (
    <div className={cn('flex gap-3', className)}>
      {/* Step Number */}
      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-surface-200 flex items-center justify-center">
        <span className="text-xs font-medium text-foreground-muted">{number}</span>
      </div>

      {/* Step Content */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-foreground mb-1">{title}</h4>

        {description && <p className="text-sm text-foreground-light mb-3">{description}</p>}

        {actions && actions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {actions.map((action, index) => {
              const handleClick = () => {
                if (onActionClick) {
                  onActionClick(action.label)
                }
                if (action.onClick) {
                  action.onClick()
                }
              }

              if (action.href) {
                return (
                  <Button
                    key={index}
                    asChild
                    type={action.variant === 'primary' ? 'primary' : 'default'}
                    size="tiny"
                    onClick={() => onActionClick?.(action.label)}
                  >
                    <a
                      href={action.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5"
                    >
                      {action.icon}
                      {action.label}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                )
              }

              return (
                <Button
                  key={index}
                  type={
                    action.variant === 'primary'
                      ? 'primary'
                      : action.variant === 'destructive'
                        ? 'danger'
                        : 'default'
                  }
                  size="tiny"
                  onClick={handleClick}
                >
                  {action.icon}
                  {action.label}
                </Button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
