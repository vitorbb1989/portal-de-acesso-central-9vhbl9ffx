import { useAppStore } from '@/stores/main'
import { PlatformCard } from '@/components/PlatformCard'
import { Activity, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

const Index = () => {
  const { platforms, searchQuery } = useAppStore()

  // Show max 4 on index page if not searching
  const displayedPlatforms = searchQuery ? platforms : platforms.slice(0, 4)

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-border/50">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
            Bom dia, Arthur
          </h1>
          <p className="text-muted-foreground">
            Acesse rapidamente as ferramentas essenciais do seu dia a dia.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white p-3 rounded-xl border shadow-subtle">
          <div className="h-10 w-10 rounded-full bg-status-success/10 flex items-center justify-center">
            <Activity className="h-5 w-5 text-status-success" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Sistemas Operacionais</p>
            <p className="text-xs text-status-success font-medium flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-status-success inline-block animate-pulse-slow" />
              Status Normal
            </p>
          </div>
        </div>
      </section>

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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
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
