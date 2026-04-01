import { cn } from '@/lib/utils'
import { type PlatformStatus } from '@/lib/platforms'

export interface StatusBadgeProps {
  status: PlatformStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig = {
    online: {
      color: 'bg-status-success',
      glow: 'shadow-[0_0_8px_rgba(16,185,129,0.4)]',
      label: 'Operacional',
    },
    warning: {
      color: 'bg-status-warning',
      glow: 'shadow-[0_0_8px_rgba(245,158,11,0.4)]',
      label: 'Instável',
    },
    offline: {
      color: 'bg-status-error',
      glow: 'shadow-[0_0_8px_rgba(239,68,68,0.4)]',
      label: 'Inativo',
    },
  }

  const currentStatus = statusConfig[status] || statusConfig.offline

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-2.5 py-1 rounded-md bg-background border border-border shadow-sm',
        className,
      )}
    >
      <div className="relative flex h-2 w-2 items-center justify-center">
        {status !== 'offline' && (
          <span
            className={cn(
              'animate-ping absolute inline-flex h-full w-full rounded-full opacity-40',
              currentStatus.color,
            )}
            style={{ animationDuration: status === 'warning' ? '3s' : '2s' }}
          ></span>
        )}
        <span
          className={cn(
            'relative inline-flex h-1.5 w-1.5 rounded-full',
            currentStatus.color,
            currentStatus.glow,
          )}
        />
      </div>
      <span className="text-[11px] font-bold text-foreground tracking-wide">
        {currentStatus.label}
      </span>
    </div>
  )
}
