import { useState } from 'react'
import { useAppStore } from '@/stores/main'
import { PlatformCard } from '@/components/PlatformCard'
import { PlatformCardSkeleton } from '@/components/PlatformCardSkeleton'
import { EmptyState } from '@/components/EmptyState'
import { ErrorState } from '@/components/ErrorState'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

const Platforms = () => {
  const { platforms, isLoading, error, retryFetch } = useAppStore()
  const [activeTab, setActiveTab] = useState<string>('all')

  const categories = Array.from(new Set(platforms.map((p) => p.category)))

  const filteredPlatforms =
    activeTab === 'all' ? platforms : platforms.filter((p) => p.category === activeTab)

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
          {Array.from({ length: 8 }).map((_, idx) => (
            <PlatformCardSkeleton key={idx} index={idx} />
          ))}
        </div>
      )
    }

    if (error) {
      return (
        <div className="mt-6">
          <ErrorState error={error} onRetry={retryFetch} />
        </div>
      )
    }

    if (filteredPlatforms.length === 0) {
      return (
        <div className="mt-6">
          <EmptyState message="Nenhuma plataforma encontrada nesta visualização." />
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
        {filteredPlatforms.map((platform, index) => (
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
    <div className="space-y-6 animate-fade-in">
      <div className="pb-5 border-b border-border">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Diretório de Plataformas</h1>
        <p className="text-sm font-medium text-muted-foreground">
          Acesse e gerencie todas as ferramentas integradas ao seu workspace.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full sm:w-auto"
        >
          <TabsList className="bg-secondary/50 border border-border h-9 p-1">
            <TabsTrigger
              value="all"
              className="text-xs font-bold px-4 py-1.5 data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm rounded"
            >
              Todas
            </TabsTrigger>
            {categories.map((cat) => (
              <TabsTrigger
                key={cat}
                value={cat}
                className="text-xs font-bold px-4 py-1.5 data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm rounded"
              >
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <span className="text-xs text-foreground font-bold bg-card px-3 py-1.5 rounded-md border border-border shadow-sm">
          {isLoading ? '-' : filteredPlatforms.length}{' '}
          {filteredPlatforms.length === 1 ? 'item' : 'itens'}
        </span>
      </div>

      {renderContent()}
    </div>
  )
}

export default Platforms
