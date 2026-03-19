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
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Plataformas</h1>
        <p className="text-muted-foreground">
          Diretório completo de ferramentas e serviços internos.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full sm:w-auto"
        >
          <TabsList className="bg-secondary/50">
            <TabsTrigger value="all">Todas</TabsTrigger>
            {categories.map((cat) => (
              <TabsTrigger key={cat} value={cat}>
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <span className="text-sm text-muted-foreground font-medium">
          {filteredPlatforms.length} {filteredPlatforms.length === 1 ? 'plataforma' : 'plataformas'}
        </span>
      </div>

      {filteredPlatforms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
          {filteredPlatforms.map((platform, index) => (
            <PlatformCard key={platform.id} platform={platform} index={index} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-secondary/30 rounded-xl border border-dashed">
          <p className="text-muted-foreground">Nenhuma plataforma encontrada nesta categoria.</p>
        </div>
      )}
    </div>
  )
}

export default Platforms
