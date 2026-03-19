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
      <div className="pb-4 border-b border-border/40">
        <h1 className="text-2xl font-semibold tracking-tight mb-1">Diretório de Plataformas</h1>
        <p className="text-sm text-muted-foreground">
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
          <TabsList className="bg-secondary/40 border border-border/40 h-8">
            <TabsTrigger
              value="all"
              className="text-xs px-3 py-1 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              Todas
            </TabsTrigger>
            {categories.map((cat) => (
              <TabsTrigger
                key={cat}
                value={cat}
                className="text-xs px-3 py-1 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <span className="text-xs text-muted-foreground font-medium bg-secondary/30 px-2 py-1 rounded border border-border/40">
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
        <div className="py-16 text-center bg-secondary/20 rounded-lg border border-dashed border-border/60">
          <p className="text-sm text-muted-foreground">
            Nenhuma plataforma encontrada nesta visualização.
          </p>
        </div>
      )}
    </div>
  )
}

export default Platforms
