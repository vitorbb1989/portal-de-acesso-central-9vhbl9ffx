import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Grid, History, Settings, LogOut, Command } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

export function AppSidebar() {
  const location = useLocation()

  const navItems = [
    { title: 'Início', url: '/', icon: LayoutDashboard },
    { title: 'Plataformas', url: '/platforms', icon: Grid },
    { title: 'Logs de Acesso', url: '/logs', icon: History },
    { title: 'Configurações', url: '/settings', icon: Settings },
  ]

  return (
    <Sidebar variant="sidebar" className="border-r-0 border-sidebar-border bg-sidebar">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-[0_0_15px_rgba(0,102,255,0.3)]">
            <Command className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-sidebar-foreground">
              Portal Central
            </span>
            <span className="text-xs text-sidebar-foreground/70">Workspace Acme Corp</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 pt-4">
        <SidebarMenu>
          {navItems.map((item) => {
            const isActive = location.pathname === item.url
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.title}
                  className={cn(
                    'h-10 transition-all rounded-md mb-1 relative overflow-hidden group/menu-btn',
                    isActive
                      ? 'bg-primary/10 text-primary shadow-[0_0_15px_rgba(0,102,255,0.05)] before:absolute before:left-0 before:top-0 before:h-full before:w-[3px] before:bg-primary before:rounded-r-full'
                      : 'text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50',
                  )}
                >
                  <Link to={item.url} className="flex items-center gap-3">
                    <item.icon
                      className={cn(
                        'h-4 w-4 transition-colors',
                        isActive
                          ? 'text-primary drop-shadow-[0_0_8px_rgba(0,102,255,0.4)]'
                          : 'text-sidebar-foreground/60 group-hover/menu-btn:text-sidebar-foreground',
                      )}
                    />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center justify-between rounded-lg bg-sidebar-accent/30 p-2 border border-sidebar-border/50 hover:bg-sidebar-accent/50 transition-colors">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 border border-sidebar-border">
              <AvatarImage
                src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=1"
                alt="Usuário"
              />
              <AvatarFallback>AS</AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium leading-none text-sidebar-foreground truncate">
                Arthur Silva
              </span>
              <span className="text-xs text-sidebar-foreground/70 mt-1 truncate">Admin</span>
            </div>
          </div>
          <button className="text-sidebar-foreground/50 hover:text-destructive transition-colors p-1">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
