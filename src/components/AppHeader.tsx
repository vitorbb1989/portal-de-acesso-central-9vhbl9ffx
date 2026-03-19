import { Search, Bell } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/stores/main'

export function AppHeader() {
  const { isMobile } = useSidebar()
  const { searchQuery, setSearchQuery } = useAppStore()

  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-4 bg-background/80 backdrop-blur-md border-b border-border/40 px-4 sm:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
      </div>

      <div className="flex flex-1 items-center justify-between">
        <div className="relative w-full max-w-sm hidden sm:flex items-center">
          <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar plataforma... (Cmd+K)"
            className="w-full bg-secondary/50 border-transparent focus-visible:bg-background focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/30 pl-9 rounded-md h-8 text-sm transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Mobile Search */}
        <div className="flex sm:hidden flex-1">
          <Input
            type="search"
            placeholder="Buscar..."
            className="w-full bg-secondary/50 border-transparent focus-visible:bg-background focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/30 h-8 text-sm rounded-md px-3"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 ml-4">
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary/40 border border-border/40">
            <div className="h-1.5 w-1.5 rounded-full bg-status-success shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
            <span className="text-[11px] font-medium text-muted-foreground">
              Sistemas operacionais
            </span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/80 relative transition-colors"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary ring-2 ring-background" />
          </Button>
        </div>
      </div>
    </header>
  )
}
