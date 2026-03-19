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
      color: 'bg-[#10B981]',
      glow: 'shadow-[0_0_12px_rgba(16,185,129,0.9)]',
      label: 'Online',
    },
    warning: {
      color: 'bg-[#F59E0B]',
      glow: 'shadow-[0_0_12px_rgba(245,158,11,0.9)]',
      label: 'Instável',
    },
    offline: {
      color: 'bg-[#EF4444]',
      glow: 'shadow-[0_0_8px_rgba(239,68,68,0.4)]',
      label: 'Offline',
    },
  }

  const currentStatus = statusConfig[platform.status]
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
        'group relative overflow-hidden transition-all duration-400 ease-out h-full flex flex-col animate-fade-in cursor-pointer',
        'bg-card border-black/[0.06] shadow-sm',
        'hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-[0_12px_32px_-4px_rgba(0,102,255,0.18)]',
      )}
      style={{ animationDelay: `${index * 50}ms` }}
      onClick={handleAccess}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/[0.01] to-black/[0.04] pointer-events-none z-0" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-50 z-20" />
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/0 to-transparent group-hover:via-primary/50 transition-all duration-500 z-20" />

      <CardHeader className="p-6 pb-0 flex flex-row items-start justify-between space-y-0 relative z-10">
        <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center text-primary group-hover:text-primary transition-colors border border-black/[0.08] shadow-sm group-hover:border-primary/20">
          <Icon className="h-6 w-6" strokeWidth={1.5} />
        </div>
        <div className="flex items-center space-x-2 bg-white/90 px-2.5 py-1.5 rounded-full border border-black/[0.06] shadow-sm backdrop-blur-md">
          <span
            className={cn(
              'h-2.5 w-2.5 rounded-full',
              currentStatus.color,
              currentStatus.glow,
              platform.status === 'online' && 'animate-pulse-slow',
            )}
          />
          <span className="text-xs font-semibold text-foreground/80">{currentStatus.label}</span>
        </div>
      </CardHeader>

      <CardContent className="p-6 pt-5 flex-grow flex flex-col relative z-10">
        <h3 className="font-semibold text-lg tracking-tight mb-2 group-hover:text-primary transition-colors">
          {platform.name}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-6 flex-grow">
          {platform.description}
        </p>

        <div className="pt-4 border-t border-black/[0.06] flex items-center justify-between mt-auto">
          <span className="text-xs text-muted-foreground font-medium bg-black/[0.03] border border-black/[0.04] px-2.5 py-1 rounded-md">
            {platform.category}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 hover:bg-primary/10 font-medium"
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
        <div className="absolute inset-0 bg-background/70 backdrop-blur-md flex items-center justify-center z-30 animate-fade-in">
          <div className="flex flex-col items-center text-primary">
            <Loader2 className="h-8 w-8 animate-spin mb-3 drop-shadow-[0_0_16px_rgba(0,102,255,0.6)]" />
            <span className="text-sm font-semibold tracking-wide">Iniciando sessão...</span>
          </div>
        </div>
      )}
    </Card>
  )
}
