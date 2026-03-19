import { useState } from 'react'
import { useAppStore } from '@/stores/main'
import { PlatformCard } from '@/components/PlatformCard'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

const Platforms = () => {
  const { platforms } = useAppStore()
  const [activeTab, setActiveTab] = useState<string>('all')

  const categories = Array.from(new Set(platforms.map((p) => p.category)))

  const filteredPlatforms =
    activeTab === 'all' ? platforms : platforms.filter((p) => p.category === activeTab)

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
          {filteredPlatforms.length} {filteredPlatforms.length === 1 ? 'item' : 'itens'}
        </span>
      </div>

      {filteredPlatforms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredPlatforms.map((platform, index) => (
            <PlatformCard key={platform.id} platform={platform} index={index} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center bg-secondary/30 rounded-xl border border-dashed border-border">
          <p className="text-sm font-medium text-muted-foreground">
            Nenhuma plataforma encontrada nesta visualização.
          </p>
        </div>
      )}
    </div>
  )
}

export default Platforms
