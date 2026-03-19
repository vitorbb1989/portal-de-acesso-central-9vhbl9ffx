import { useAppStore } from '@/stores/main'
import { PlatformCard } from '@/components/PlatformCard'
import { PlatformCardSkeleton } from '@/components/PlatformCardSkeleton'
import { EmptyState } from '@/components/EmptyState'
import { ErrorState } from '@/components/ErrorState'
import { ArrowRight, Clock, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

const Index = () => {
  const { platforms, searchQuery, isLoading, error, retryFetch, branding } = useAppStore()

  const displayedPlatforms = searchQuery ? platforms : platforms.slice(0, 4)

  const renderGrid = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <PlatformCardSkeleton key={idx} index={idx} />
          ))}
        </div>
      )
    }

    if (error) {
      return <ErrorState error={error} onRetry={retryFetch} />
    }

    if (displayedPlatforms.length === 0) {
      return (
        <EmptyState
          message={
            searchQuery
              ? `Nenhum resultado para "${searchQuery}"`
              : 'Nenhum módulo atribuído ao seu tenant.'
          }
        />
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {displayedPlatforms.map((platform, index) => (
          <PlatformCard
            key={platform.id}
            id={platform.id}
            title={platform.name}
            description={platform.description}
            icon={platform.icon}
            status={platform.status}
            category={platform.category}
            accessLevel={platform.hasAccess === false ? 'restricted' : 'full'}
            url={platform.url}
            openMode={platform.openMode}
            index={index}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-border relative">
        <div className="flex flex-col gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">
              Portal {branding?.name || 'AntropIA'}
            </h1>
            <p className="text-sm font-medium text-muted-foreground">
              Sistemas atribuídos ao seu workspace operando normalmente.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-1">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-card rounded-md border border-border shadow-sm">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                Workspace
              </span>
              <span className="text-xs font-bold text-foreground">
                {branding?.name || 'AntropIA'} Corp
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-card rounded-md border border-border shadow-sm">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                Plano
              </span>
              <span className="text-xs font-bold text-primary">Enterprise</span>
            </div>
          </div>
        </div>

        <Button
          asChild
          size="sm"
          className="h-9 px-4 font-bold shadow-sm hover:shadow-md hover:bg-primary/90 transition-all text-xs"
        >
          <Link to="/platforms/new">
            <Plus className="mr-1.5 h-4 w-4" strokeWidth={2.5} />
            Nova Plataforma
          </Link>
        </Button>
      </section>

      {!searchQuery && !isLoading && !error && platforms.length > 0 && (
        <section className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 px-5 py-4 rounded-xl border border-border bg-card shadow-sm relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-status-success" />

          <div className="flex items-center gap-2.5">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-success opacity-40"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-status-success shadow-[0_0_6px_rgba(16,185,129,0.4)]"></span>
            </div>
            <span className="text-xs font-bold text-foreground">
              {platforms.filter((p) => p.status === 'online').length} sistemas operacionais
            </span>
          </div>

          <div className="hidden sm:block w-px h-5 bg-border" />

          <div className="flex items-center gap-2.5">
            <div className="relative flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-status-warning shadow-[0_0_6px_rgba(245,158,11,0.4)]"></span>
            </div>
            <span className="text-xs font-bold text-foreground">
              {platforms.filter((p) => p.status !== 'online').length} sistema instável
            </span>
          </div>

          <div className="hidden sm:block w-px h-5 bg-border" />

          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" strokeWidth={2.5} />
            <span className="text-xs font-bold">Sincronizado há 2 min</span>
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold tracking-tight">
            {searchQuery ? 'Resultados da Busca' : 'Acesso Rápido'}
          </h2>
          {!searchQuery && !isLoading && !error && platforms.length > 0 && (
            <Button
              variant="ghost"
              asChild
              className="text-primary hover:text-primary hover:bg-primary/10 transition-colors group h-8 px-3 text-sm font-bold"
            >
              <Link to="/platforms">
                Ver todos{' '}
                <ArrowRight
                  className="ml-1.5 h-4 w-4 group-hover:translate-x-1 transition-transform"
                  strokeWidth={2.5}
                />
              </Link>
            </Button>
          )}
        </div>

        {renderGrid()}
      </section>
    </div>
  )
}

export default Index
