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
    online: { color: 'bg-status-success', label: 'Online' },
    warning: { color: 'bg-status-warning', label: 'Instável' },
    offline: { color: 'bg-status-error', label: 'Offline' },
  }

  const currentStatus = statusConfig[platform.status]
  const Icon = platform.icon

  const handleAccess = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsConnecting(true)
    // Simulate connection delay
    setTimeout(() => {
      setIsConnecting(false)
      // Open in new tab in real scenario, here we just simulate
      console.log(`Navigating to ${platform.url}`)
    }, 800)
  }

  return (
    <Card
      className={cn(
        'group relative overflow-hidden transition-all duration-300 ease-out hover:shadow-elevation hover:-translate-y-1 hover:border-primary/50 cursor-pointer h-full flex flex-col animate-fade-in',
      )}
      style={{ animationDelay: `${index * 50}ms` }}
      onClick={handleAccess}
    >
      <CardHeader className="p-5 pb-0 flex flex-row items-start justify-between space-y-0">
        <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors">
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex items-center space-x-1.5 bg-secondary/50 px-2 py-1 rounded-full border border-border/50">
          <span
            className={cn(
              'h-2 w-2 rounded-full',
              currentStatus.color,
              platform.status === 'online' && 'animate-pulse-slow',
            )}
          />
          <span className="text-xs font-medium text-muted-foreground">{currentStatus.label}</span>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-4 flex-grow flex flex-col">
        <h3 className="font-semibold text-lg tracking-tight mb-1 group-hover:text-primary transition-colors">
          {platform.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-grow">
          {platform.description}
        </p>

        {/* Fake sparkline for visual flair */}
        <div className="flex items-end gap-1 h-6 mb-4 opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all">
          {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
            <div
              key={i}
              className={cn(
                'w-full rounded-t-sm',
                platform.status === 'offline'
                  ? 'bg-status-error/50'
                  : platform.status === 'warning'
                    ? 'bg-status-warning/50'
                    : 'bg-primary/50',
              )}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>

        <div className="pt-2 border-t flex items-center justify-between mt-auto">
          <span className="text-xs text-muted-foreground font-medium">{platform.category}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
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
                Acessar <ExternalLink className="ml-1 h-3 w-3" />
              </>
            )}
          </Button>
        </div>
      </CardContent>

      {/* Connection Overlay */}
      {isConnecting && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10 animate-fade-in">
          <div className="flex flex-col items-center text-primary">
            <Loader2 className="h-8 w-8 animate-spin mb-2" />
            <span className="text-sm font-medium">Conectando...</span>
          </div>
        </div>
      )}
    </Card>
  )
}
