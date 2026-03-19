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
    <Sidebar variant="sidebar" className="border-r border-sidebar-border/30 bg-sidebar">
      <SidebarHeader className="p-5 border-b border-sidebar-border/20">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[0_0_20px_rgba(0,102,255,0.5)]">
            <Command className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-sidebar-foreground">
              Portal Central
            </span>
            <span className="text-xs text-sidebar-foreground/60 font-medium">Acme Corp</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 pt-6">
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
                    'h-10 transition-all duration-200 rounded-md mb-1.5 relative overflow-hidden group/menu-btn',
                    isActive
                      ? 'bg-primary/10 text-primary shadow-[inset_0_0_20px_rgba(0,102,255,0.05)] before:absolute before:left-0 before:top-0 before:h-full before:w-[3px] before:bg-primary before:rounded-r-full'
                      : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/40',
                  )}
                >
                  <Link to={item.url} className="flex items-center gap-3 px-1">
                    <item.icon
                      className={cn(
                        'h-4 w-4 transition-colors',
                        isActive
                          ? 'text-primary drop-shadow-[0_0_10px_rgba(0,102,255,0.5)]'
                          : 'text-sidebar-foreground/50 group-hover/menu-btn:text-sidebar-foreground/90',
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
        <div className="flex items-center justify-between rounded-xl bg-sidebar-accent/10 p-2.5 border border-sidebar-border/20 hover:bg-sidebar-accent/30 hover:border-sidebar-border/40 transition-all cursor-pointer">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border border-sidebar-border/50 shadow-sm">
              <AvatarImage
                src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=1"
                alt="Usuário"
              />
              <AvatarFallback>AS</AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold leading-none text-sidebar-foreground truncate">
                Arthur Silva
              </span>
              <span className="text-xs text-sidebar-foreground/50 mt-1.5 font-medium truncate">
                Administrador
              </span>
            </div>
          </div>
          <button className="text-sidebar-foreground/40 hover:text-primary transition-colors p-1.5 rounded-md hover:bg-primary/10">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
