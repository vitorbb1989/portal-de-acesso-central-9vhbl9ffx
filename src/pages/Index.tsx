import { useAppStore } from '@/stores/main'
import { PlatformCard } from '@/components/PlatformCard'
import { ArrowRight, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

const Index = () => {
  const { platforms, searchQuery } = useAppStore()

  // Show max 4 on index page if not searching
  const displayedPlatforms = searchQuery ? platforms : platforms.slice(0, 4)

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome & Metadata Section */}
      <section className="flex flex-col gap-5 pb-6 border-b border-border/60">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
            Seu workspace está pronto
          </h1>
          <p className="text-muted-foreground text-lg">
            Todos os sistemas disponíveis para a sua conta estão operacionais.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/40 rounded-lg border border-border/50">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              Workspace
            </span>
            <span className="text-sm font-medium text-foreground">Acme Corp</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/40 rounded-lg border border-border/50">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              Plano
            </span>
            <span className="text-sm font-medium text-primary">Professional</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/40 rounded-lg border border-border/50">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              Módulos Ativos
            </span>
            <span className="text-sm font-medium text-foreground">4</span>
          </div>
        </div>
      </section>

      {/* System Context Block */}
      {!searchQuery && (
        <section className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 rounded-xl border border-border/50 bg-secondary/20 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-2 w-2 rounded-full bg-status-success shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse-slow" />
            <span className="text-sm font-medium text-foreground">4 plataformas disponíveis</span>
          </div>

          <div className="hidden sm:block w-px h-4 bg-border" />

          <div className="flex items-center gap-3">
            <div className="flex h-2 w-2 rounded-full bg-status-warning shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
            <span className="text-sm font-medium text-foreground">1 sistema instável</span>
          </div>

          <div className="hidden sm:block w-px h-4 bg-border" />

          <div className="flex items-center gap-3 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">Última sincronização: há 2 minutos</span>
          </div>
        </section>
      )}

      {/* Grid Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold tracking-tight">
            {searchQuery ? 'Resultados da Pesquisa' : 'Acesso Rápido'}
          </h2>
          {!searchQuery && (
            <Button
              variant="ghost"
              asChild
              className="text-primary hover:text-primary hover:bg-primary/10"
            >
              <Link to="/platforms">
                Ver todas <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>

        {displayedPlatforms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {displayedPlatforms.map((platform, index) => (
              <PlatformCard key={platform.id} platform={platform} index={index} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center bg-secondary/30 rounded-xl border border-dashed">
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
