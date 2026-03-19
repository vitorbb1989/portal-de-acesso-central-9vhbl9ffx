import { Search, Bell } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/stores/main'

export function AppHeader() {
  const { isMobile } = useSidebar()
  const { searchQuery, setSearchQuery } = useAppStore()

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-4 glass-header px-4 sm:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
      </div>

      <div className="flex flex-1 items-center justify-between">
        <div className="relative w-full max-w-md hidden sm:flex items-center">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar plataforma... (Cmd+K)"
            className="w-full bg-secondary/30 border-primary/10 focus-visible:bg-background focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20 pl-10 rounded-full h-9 shadow-sm transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Mobile Search - simplified */}
        <div className="flex sm:hidden flex-1">
          <Input
            type="search"
            placeholder="Buscar..."
            className="w-full bg-secondary/30 border-primary/10 h-9 rounded-full px-4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 ml-4">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-status-success/10 border border-status-success/20">
            <div className="h-2 w-2 rounded-full bg-status-success shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse-slow" />
            <span className="text-xs font-medium text-status-success">Sistemas operacionais</span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 relative transition-colors"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-white shadow-[0_0_8px_rgba(0,102,255,0.6)]" />
          </Button>
        </div>
      </div>
    </header>
  )
}
