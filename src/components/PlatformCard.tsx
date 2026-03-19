import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, ExternalLink, Lock, Maximize2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { StatusBadge } from './StatusBadge'
import { PlatformStatus } from '@/lib/mock-data'

export interface PlatformCardProps {
  id: string
  title: string
  description: string
  icon: any
  status: PlatformStatus
  category: string
  accessLevel?: 'full' | 'restricted'
  url?: string
  index?: number
  openMode?: 'new_tab' | 'internal'
}

export function PlatformCard({
  id,
  title,
  description,
  icon: Icon,
  status,
  category,
  accessLevel = 'full',
  url,
  index = 0,
  openMode = 'new_tab',
}: PlatformCardProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const navigate = useNavigate()

  const isRestricted = accessLevel === 'restricted'
  const isOffline = status === 'offline'

  const getCategoryColor = (cat: string) => {
    if (isRestricted || isOffline) {
      return 'bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-focus:bg-slate-200'
    }
    switch (cat) {
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
    e.stopPropagation()
    if (isRestricted || isOffline) return
    setIsConnecting(true)

    // Simulate connection latency before acting on routing
    setTimeout(() => {
      setIsConnecting(false)
      if (openMode === 'internal') {
        navigate(`/platform/${id}`)
      } else {
        if (url) window.open(url, '_blank', 'noopener,noreferrer')
      }
    }, 600)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleAccess(e as any)
    }
  }

  return (
    <Card
      tabIndex={isRestricted || isOffline ? -1 : 0}
      role={isRestricted || isOffline ? 'article' : 'button'}
      onKeyDown={handleKeyDown}
      onClick={handleAccess}
      className={cn(
        'group relative overflow-hidden transition-all duration-200 ease-out h-full flex flex-col animate-fade-in outline-none',
        'bg-card border-border shadow-sm',
        !isRestricted &&
          !isOffline && [
            'cursor-pointer hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_8px_24px_-12px_rgba(0,102,255,0.4)]',
            'focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-primary/[0.02]',
          ],
        isRestricted && 'opacity-80 bg-secondary/20',
        isOffline && 'opacity-90 bg-secondary/10',
      )}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between space-y-0">
        <div
          className={cn(
            'h-11 w-11 rounded-xl flex items-center justify-center transition-colors duration-200',
            getCategoryColor(category),
          )}
        >
          {Icon && <Icon className="h-5 w-5" strokeWidth={2.5} />}
        </div>
        <StatusBadge status={status} />
      </CardHeader>

      <CardContent className="p-5 pt-2 flex-grow flex flex-col">
        <div className="flex items-center justify-between mb-1.5">
          <h3
            className={cn(
              'font-bold text-base tracking-tight transition-colors duration-200',
              isRestricted || isOffline
                ? 'text-muted-foreground'
                : 'text-foreground group-hover:text-primary group-focus:text-primary',
            )}
          >
            {title || 'Não identificado'}
          </h3>
          {isRestricted && <Lock className="h-4 w-4 text-muted-foreground/50" />}
        </div>
        <p className="text-[13px] text-muted-foreground leading-relaxed line-clamp-2 mb-4 flex-grow font-medium">
          {description || 'Sem descrição.'}
        </p>

        <div className="pt-4 border-t border-border flex items-center justify-between mt-auto transition-colors duration-200">
          <span className="text-[11px] font-bold tracking-wide uppercase px-2 py-1 rounded-md bg-secondary text-secondary-foreground border border-border/50">
            {category || 'Geral'}
          </span>
          <Button
            size="sm"
            tabIndex={-1}
            disabled={isRestricted || isOffline || isConnecting}
            className={cn(
              'h-8 px-3.5 text-xs font-semibold shadow-none transition-all duration-200 ease-out',
              isRestricted || isOffline
                ? 'bg-secondary text-muted-foreground opacity-100'
                : 'bg-primary/10 text-primary opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 group-focus:opacity-100 group-focus:translate-y-0 hover:bg-primary hover:text-white',
            )}
            onClick={(e) => {
              // Ensure we don't trigger the card click again
              e.stopPropagation()
              handleAccess(e)
            }}
          >
            {isConnecting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : isRestricted ? (
              <>
                Restrito <Lock className="ml-1.5 h-3 w-3" strokeWidth={2.5} />
              </>
            ) : isOffline ? (
              'Indisponível'
            ) : (
              <>
                Acessar
                {openMode === 'internal' ? (
                  <Maximize2 className="ml-1.5 h-3.5 w-3.5" strokeWidth={2.5} />
                ) : (
                  <ExternalLink className="ml-1.5 h-3.5 w-3.5" strokeWidth={2.5} />
                )}
              </>
            )}
          </Button>
        </div>
      </CardContent>

      {isConnecting && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px] flex items-center justify-center z-30 animate-fade-in rounded-lg">
          <div className="flex flex-col items-center text-primary">
            <Loader2 className="h-8 w-8 animate-spin mb-3" strokeWidth={3} />
            <span className="text-sm font-bold">Autenticando...</span>
          </div>
        </div>
      )}
    </Card>
  )
}
