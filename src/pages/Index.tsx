import { useAppStore } from '@/stores/main'
import { PlatformCard } from '@/components/PlatformCard'
import { ArrowRight, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

const Index = () => {
  const { platforms, searchQuery } = useAppStore()

  const displayedPlatforms = searchQuery ? platforms : platforms.slice(0, 4)

  return (
    <div className="space-y-8 animate-fade-in">
      <section className="flex flex-col gap-5 pb-6 border-b border-border/50 relative">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
            Seu workspace está totalmente operacional
          </h1>
          <p className="text-muted-foreground text-lg">
            Todos os sistemas atribuídos ao seu workspace estão operando normalmente.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-b from-secondary/50 to-secondary/20 rounded-lg border border-black/[0.04] shadow-sm">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              Workspace
            </span>
            <span className="text-sm font-medium text-foreground">Acme Corp</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-b from-secondary/50 to-secondary/20 rounded-lg border border-black/[0.04] shadow-sm">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              Plano
            </span>
            <span className="text-sm font-medium text-primary">Professional</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-b from-secondary/50 to-secondary/20 rounded-lg border border-black/[0.04] shadow-sm">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              Módulos Ativos
            </span>
            <span className="text-sm font-medium text-foreground">4</span>
          </div>
        </div>
      </section>

      {!searchQuery && (
        <section className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 rounded-xl border border-black/[0.04] bg-gradient-to-r from-secondary/40 via-secondary/20 to-transparent shadow-sm relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/20" />

          <div className="flex items-center gap-3">
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-status-success shadow-[0_0_12px_rgba(16,185,129,0.8)]"></span>
            </div>
            <span className="text-sm font-medium text-foreground">4 plataformas disponíveis</span>
          </div>

          <div className="hidden sm:block w-px h-5 bg-border/80" />

          <div className="flex items-center gap-3">
            <div className="relative flex h-2.5 w-2.5">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-warning opacity-40"
                style={{ animationDuration: '3s' }}
              ></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-status-warning shadow-[0_0_12px_rgba(245,158,11,0.8)]"></span>
            </div>
            <span className="text-sm font-medium text-foreground">1 sistema instável</span>
          </div>

          <div className="hidden sm:block w-px h-5 bg-border/80" />

          <div className="flex items-center gap-3 text-muted-foreground">
            <Clock className="h-4 w-4 text-primary/70" />
            <span className="text-sm font-medium">Última sincronização: há 2 min</span>
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold tracking-tight">
            {searchQuery ? 'Resultados da Busca' : 'Acesso Rápido'}
          </h2>
          {!searchQuery && (
            <Button
              variant="ghost"
              asChild
              className="text-primary hover:text-primary hover:bg-primary/10 transition-colors group"
            >
              <Link to="/platforms">
                Ver todos{' '}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          )}
        </div>

        {displayedPlatforms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
            {displayedPlatforms.map((platform, index) => (
              <PlatformCard key={platform.id} platform={platform} index={index} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center bg-secondary/30 rounded-xl border border-dashed border-border">
            <p className="text-muted-foreground">
              Nenhuma plataforma encontrada para "{searchQuery}"
            </p>
          </div>
        )}
      </section>
    </div>
  )
}

export default Index
