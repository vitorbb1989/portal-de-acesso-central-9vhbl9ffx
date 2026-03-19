import { useState } from 'react'
import { Platform } from '@/lib/mock-data'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PlatformCardProps {
  platform: Platform
  index?: number
}

export function PlatformCard({ platform, index = 0 }: PlatformCardProps) {
  const [isConnecting, setIsConnecting] = useState(false)

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

  const currentStatus = statusConfig[platform.status] || statusConfig.offline
  const Icon = platform.icon

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'CRM':
        return 'bg-violet-100 text-violet-700 group-hover:bg-violet-200 group-focus:bg-violet-200'
      case 'Infra':
        return 'bg-blue-100 text-blue-700 group-hover:bg-blue-200 group-focus:bg-blue-200'
      case 'DevTools':
        return 'bg-amber-100 text-amber-700 group-hover:bg-amber-200 group-focus:bg-amber-200'
      case 'Marketing':
        return 'bg-emerald-100 text-emerald-700 group-hover:bg-emerald-200 group-focus:bg-emerald-200'
      case 'Comunicação':
        return 'bg-rose-100 text-rose-700 group-hover:bg-rose-200 group-focus:bg-rose-200'
      default:
        return 'bg-slate-100 text-slate-700 group-hover:bg-slate-200 group-focus:bg-slate-200'
    }
  }

  const handleAccess = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsConnecting(true)
    setTimeout(() => {
      setIsConnecting(false)
      console.log(`Navigating to ${platform.url}`)
    }, 800)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleAccess(e as any)
    }
  }

  return (
    <Card
      tabIndex={0}
      role="button"
      onKeyDown={handleKeyDown}
      onClick={handleAccess}
      className={cn(
        'group relative overflow-hidden transition-all duration-200 ease-out h-full flex flex-col animate-fade-in outline-none cursor-pointer',
        'bg-card border-border shadow-sm',
        'hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_8px_24px_-12px_rgba(0,102,255,0.4)]',
        'focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-primary/[0.02]',
      )}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between space-y-0">
        <div
          className={cn(
            'h-11 w-11 rounded-xl flex items-center justify-center transition-colors duration-200',
            getCategoryColor(platform.category),
          )}
        >
          {Icon && <Icon className="h-5 w-5" strokeWidth={2.5} />}
        </div>
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-background border border-border shadow-sm">
          <div className="relative flex h-2 w-2 items-center justify-center">
            {platform.status !== 'offline' && (
              <span
                className={cn(
                  'animate-ping absolute inline-flex h-full w-full rounded-full opacity-40',
                  currentStatus.color,
                )}
                style={{ animationDuration: platform.status === 'warning' ? '3s' : '2s' }}
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
      </CardHeader>

      <CardContent className="p-5 pt-2 flex-grow flex flex-col">
        <h3 className="font-bold text-base tracking-tight mb-1.5 text-foreground group-hover:text-primary group-focus:text-primary transition-colors duration-200">
          {platform.name || 'Não identificado'}
        </h3>
        <p className="text-[13px] text-muted-foreground leading-relaxed line-clamp-2 mb-4 flex-grow font-medium">
          {platform.description || 'Sem descrição.'}
        </p>

        <div className="pt-4 border-t border-border flex items-center justify-between mt-auto transition-colors duration-200">
          <span className="text-[11px] font-bold tracking-wide uppercase px-2 py-1 rounded-md bg-secondary text-secondary-foreground border border-border/50">
            {platform.category || 'Geral'}
          </span>
          <Button
            size="sm"
            tabIndex={-1}
            className={cn(
              'h-8 px-3.5 text-xs font-semibold bg-primary/10 text-primary shadow-none',
              'opacity-0 translate-y-2',
              'group-hover:opacity-100 group-hover:translate-y-0 hover:bg-primary hover:text-white',
              'group-focus:opacity-100 group-focus:translate-y-0',
              'transition-all duration-200 ease-out',
            )}
            onClick={(e) => {
              e.stopPropagation()
              handleAccess(e)
            }}
            disabled={isConnecting}
          >
            {isConnecting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <>
                Acessar <ExternalLink className="ml-1.5 h-3.5 w-3.5" strokeWidth={2.5} />
              </>
            )}
          </Button>
        </div>
      </CardContent>

      {isConnecting && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px] flex items-center justify-center z-30 animate-fade-in">
          <div className="flex flex-col items-center text-primary">
            <Loader2 className="h-8 w-8 animate-spin mb-3" strokeWidth={3} />
            <span className="text-sm font-bold">Autenticando...</span>
          </div>
        </div>
      )}
    </Card>
  )
}
