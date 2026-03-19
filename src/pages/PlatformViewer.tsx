import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppStore } from '@/stores/main'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, ExternalLink, Loader2, Maximize2 } from 'lucide-react'
import { ErrorState } from '@/components/ErrorState'
import { StatusBadge } from '@/components/StatusBadge'

export default function PlatformViewer() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { platforms } = useAppStore()
  const [isLoading, setIsLoading] = useState(true)

  const platform = platforms.find((p) => p.id === id)

  if (!platform) {
    return (
      <div className="pt-8">
        <ErrorState
          error="Plataforma não encontrada no diretório."
          onRetry={() => navigate('/platforms')}
        />
      </div>
    )
  }

  if (platform.hasAccess === false || platform.status === 'offline') {
    return (
      <div className="pt-8">
        <ErrorState
          error={
            platform.hasAccess === false
              ? 'Você não possui permissão para acessar esta plataforma.'
              : 'A plataforma encontra-se indisponível no momento.'
          }
          onRetry={() => navigate('/platforms')}
        />
      </div>
    )
  }

  const Icon = platform.icon

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.24))] animate-fade-in space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-primary/10 text-primary flex items-center justify-center">
              {Icon ? <Icon className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold leading-none tracking-tight">{platform.name}</h1>
                <StatusBadge status={platform.status} className="scale-75 origin-left py-0 h-4" />
              </div>
              <span className="text-xs text-muted-foreground font-medium truncate max-w-[200px] sm:max-w-md">
                {platform.url}
              </span>
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(platform.url, '_blank', 'noopener,noreferrer')}
          className="h-8 text-xs font-semibold shadow-sm"
        >
          <ExternalLink className="mr-2 h-3.5 w-3.5" />
          <span className="hidden sm:inline">Abrir em Nova Guia</span>
          <span className="inline sm:hidden">Externo</span>
        </Button>
      </div>

      <Card className="flex-1 overflow-hidden relative shadow-elevation border-border/60 bg-muted/10 rounded-xl">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" strokeWidth={3} />
            <span className="text-sm font-bold text-foreground">Conectando ao sistema...</span>
          </div>
        )}
        <iframe
          src={platform.url}
          className="w-full h-full border-0"
          onLoad={() => setIsLoading(false)}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          title={`Visualizador de ${platform.name}`}
        />
      </Card>
    </div>
  )
}
