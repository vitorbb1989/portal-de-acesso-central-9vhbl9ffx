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
      glow: 'shadow-[0_0_8px_rgba(16,185,129,0.3)]',
      label: 'Operacional',
    },
    warning: {
      color: 'bg-status-warning',
      glow: 'shadow-[0_0_8px_rgba(245,158,11,0.3)]',
      label: 'Instável',
    },
    offline: {
      color: 'bg-status-error',
      glow: 'shadow-[0_0_8px_rgba(239,68,68,0.3)]',
      label: 'Inativo',
    },
  }

  const currentStatus = statusConfig[platform.status] || statusConfig.offline
  const Icon = platform.icon

  const handleAccess = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsConnecting(true)
    setTimeout(() => {
      setIsConnecting(false)
      console.log(`Navigating to ${platform.url}`)
    }, 800)
  }

  return (
    <Card
      className={cn(
        'group relative overflow-hidden transition-all duration-200 ease-out h-full flex flex-col animate-fade-in cursor-pointer',
        'bg-card border-border/60 shadow-sm',
        'hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md hover:ring-1 hover:ring-primary/10',
      )}
      style={{ animationDelay: `${index * 40}ms` }}
      onClick={handleAccess}
    >
      <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between space-y-0">
        <div
          className={cn(
            'h-10 w-10 rounded-lg flex items-center justify-center border border-border/40 bg-secondary/30 transition-colors duration-200',
            'group-hover:bg-primary/[0.04] group-hover:border-primary/20',
          )}
        >
          {Icon && (
            <Icon
              className="h-5 w-5 text-foreground/70 group-hover:text-primary transition-colors duration-200"
              strokeWidth={1.5}
            />
          )}
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-secondary/40 border border-border/30">
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
          <span className="text-[11px] font-medium text-muted-foreground">
            {currentStatus.label}
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-2 flex-grow flex flex-col">
        <h3 className="font-semibold text-base tracking-tight mb-1 text-foreground/90 group-hover:text-primary transition-colors duration-200">
          {platform.name || 'Não identificado'}
        </h3>
        <p className="text-[13px] text-muted-foreground leading-snug line-clamp-2 mb-4 flex-grow">
          {platform.description || 'Sem descrição.'}
        </p>

        <div className="pt-4 border-t border-border/40 flex items-center justify-between mt-auto group-hover:border-primary/10 transition-colors duration-200">
          <span className="text-[11px] text-muted-foreground font-medium px-2 py-0.5 rounded-md bg-secondary/30 border border-border/40">
            {platform.category || 'Geral'}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2.5 text-[12px] font-medium text-primary opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 ease-out hover:bg-primary/10"
            onClick={(e) => {
              e.stopPropagation()
              handleAccess(e)
            }}
            disabled={isConnecting}
          >
            {isConnecting ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <>
                Acessar <ExternalLink className="ml-1.5 h-3 w-3" />
              </>
            )}
          </Button>
        </div>
      </CardContent>

      {isConnecting && (
        <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center z-30 animate-fade-in">
          <div className="flex flex-col items-center text-primary">
            <Loader2 className="h-6 w-6 animate-spin mb-2" />
            <span className="text-xs font-medium">Autenticando...</span>
          </div>
        </div>
      )}
    </Card>
  )
}
