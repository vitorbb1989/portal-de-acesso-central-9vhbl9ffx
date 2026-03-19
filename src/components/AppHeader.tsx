import { Search, Bell, Command, Settings as SettingsIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAppStore } from '@/stores/main'

export function AppHeader() {
  const { isMobile } = useSidebar()
  const { searchQuery, setSearchQuery, branding } = useAppStore()

  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border px-4 sm:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
        <div className="md:hidden flex items-center gap-2 ml-1">
          {branding?.iconUrl ? (
            <img
              src={branding.iconUrl}
              alt={branding?.name || 'Brand Icon'}
              className="h-7 w-7 object-contain drop-shadow-sm"
            />
          ) : (
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Command className="h-4 w-4" strokeWidth={2.5} />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 items-center justify-between">
        <div className="relative w-full max-w-sm hidden sm:flex items-center">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar plataforma... (Cmd+K)"
            className="w-full bg-secondary/50 border-transparent focus-visible:bg-card focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 pl-9 rounded-md h-9 text-sm font-medium transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Mobile Search */}
        <div className="flex sm:hidden flex-1">
          <Input
            type="search"
            placeholder="Buscar..."
            className="w-full bg-secondary/50 border-transparent focus-visible:bg-card focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 h-9 text-sm font-medium rounded-md px-3 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 ml-4">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-md bg-card border border-border shadow-sm">
            <div className="h-2 w-2 rounded-full bg-status-success shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <span className="text-xs font-bold text-foreground/80">Sistemas operacionais</span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary relative transition-colors"
          >
            <Bell className="h-4 w-4" strokeWidth={2.5} />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary ring-2 ring-background shadow-[0_0_8px_rgba(0,102,255,0.6)]" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full shrink-0">
                <Avatar className="h-9 w-9 border border-border shadow-sm">
                  <AvatarImage
                    src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=1"
                    alt="Usuário"
                  />
                  <AvatarFallback>US</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Arthur Silva</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    arthur.silva@acmecorp.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/settings" className="cursor-pointer w-full flex items-center">
                  <SettingsIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Configurações</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
