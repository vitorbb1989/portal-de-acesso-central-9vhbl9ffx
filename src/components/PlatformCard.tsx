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
      glow: 'shadow-[0_0_8px_rgba(16,185,129,0.5)]',
      label: 'Operacional',
    },
    warning: {
      color: 'bg-status-warning',
      glow: 'shadow-[0_0_8px_rgba(245,158,11,0.5)]',
      label: 'Instável',
    },
    offline: {
      color: 'bg-status-error',
      glow: 'shadow-[0_0_8px_rgba(239,68,68,0.5)]',
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
        'group relative overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] h-full flex flex-col animate-fade-in cursor-pointer',
        'bg-gradient-to-b from-white to-secondary/30 border border-black/[0.04] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.6)]',
        'hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[0_12px_40px_-8px_rgba(0,102,255,0.25),inset_0_1px_0_rgba(255,255,255,1)] hover:bg-gradient-to-b hover:from-white hover:to-primary/[0.02]',
      )}
      style={{ animationDelay: `${index * 50}ms` }}
      onClick={handleAccess}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] to-transparent pointer-events-none z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]" />
      <div
        className="absolute top-0 left-0 w-full h-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] z-20 transform scale-x-0 group-hover:scale-x-100"
        style={{
          background: platform.color
            ? `linear-gradient(to right, transparent, ${platform.color}, transparent)`
            : 'linear-gradient(to right, transparent, hsl(var(--primary)), transparent)',
        }}
      />

      <CardHeader className="p-6 pb-0 flex flex-row items-start justify-between space-y-0 relative z-10">
        <div
          className="h-12 w-12 rounded-xl bg-white flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] border border-black/[0.04] shadow-[0_2px_8px_rgba(0,0,0,0.04)] group-hover:shadow-[0_0_20px_rgba(0,102,255,0.2)] group-hover:scale-[1.03]"
          style={
            platform.color
              ? { color: platform.color, borderColor: `${platform.color}40` }
              : { color: 'hsl(var(--primary))' }
          }
        >
          {Icon && <Icon className="h-6 w-6" strokeWidth={1.5} />}
        </div>
        <div className="flex items-center space-x-2 bg-white/90 px-2.5 py-1.5 rounded-full border border-black/[0.03] shadow-sm backdrop-blur-md">
          <div className="relative flex h-2.5 w-2.5 items-center justify-center">
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
                'relative inline-flex h-2.5 w-2.5 rounded-full',
                currentStatus.color,
                currentStatus.glow,
              )}
            />
          </div>
          <span className="text-xs font-semibold text-foreground/80">{currentStatus.label}</span>
        </div>
      </CardHeader>

      <CardContent className="p-6 pt-5 flex-grow flex flex-col relative z-10">
        <h3 className="font-semibold text-lg tracking-tight mb-2 group-hover:text-primary transition-colors duration-300">
          {platform.name || 'Sem Nome'}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-6 flex-grow">
          {platform.description || 'Nenhuma descrição fornecida.'}
        </p>

        <div className="pt-4 border-t border-black/[0.04] flex items-center justify-between mt-auto group-hover:border-primary/10 transition-colors duration-300">
          <span className="text-xs text-muted-foreground font-medium bg-black/[0.02] border border-black/[0.04] px-2.5 py-1 rounded-md">
            {platform.category || 'Geral'}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-primary/10 font-medium"
            onClick={(e) => {
              e.stopPropagation()
              handleAccess(e)
            }}
            disabled={isConnecting}
          >
            {isConnecting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Acessar <ExternalLink className="ml-2 h-3.5 w-3.5" />
              </>
            )}
          </Button>
        </div>
      </CardContent>

      {isConnecting && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-md flex items-center justify-center z-30 animate-fade-in rounded-lg">
          <div className="flex flex-col items-center text-primary">
            <Loader2 className="h-8 w-8 animate-spin mb-3 drop-shadow-[0_0_12px_rgba(0,102,255,0.4)]" />
            <span className="text-sm font-semibold tracking-wide">Autenticando...</span>
          </div>
        </div>
      )}
    </Card>
  )
}
