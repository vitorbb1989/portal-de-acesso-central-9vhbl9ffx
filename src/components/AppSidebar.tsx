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
    { title: 'Visão Geral', url: '/', icon: LayoutDashboard },
    { title: 'Plataformas', url: '/platforms', icon: Grid },
    { title: 'Logs de Acesso', url: '/logs', icon: History },
    { title: 'Configurações', url: '/settings', icon: Settings },
  ]

  return (
    <Sidebar variant="sidebar" className="border-r border-sidebar-border bg-[#0a0a0a]">
      <SidebarHeader className="p-4 border-b border-sidebar-border/50">
        <div className="flex items-center gap-3 px-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Command className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight text-sidebar-foreground">
              AntropIA
            </span>
            <span className="text-[11px] text-sidebar-foreground/60 font-medium leading-none mt-0.5">
              Portal Central
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 pt-5">
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
                    'h-9 transition-all duration-200 rounded-md mb-0.5 relative group/menu-btn',
                    isActive
                      ? 'bg-primary/10 text-primary font-medium before:absolute before:left-0 before:top-[10%] before:h-[80%] before:w-[3px] before:bg-primary before:rounded-r-sm'
                      : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50',
                  )}
                >
                  <Link to={item.url} className="flex items-center gap-3 px-2 w-full">
                    <item.icon
                      className={cn(
                        'h-4 w-4 transition-colors',
                        isActive
                          ? 'text-primary'
                          : 'text-sidebar-foreground/50 group-hover/menu-btn:text-sidebar-foreground',
                      )}
                      strokeWidth={isActive ? 2 : 1.5}
                    />
                    <span className="text-sm">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center justify-between rounded-md p-2 hover:bg-sidebar-accent/50 transition-colors cursor-pointer group">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 border border-sidebar-border/50">
              <AvatarImage
                src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=1"
                alt="User"
              />
              <AvatarFallback>AS</AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium leading-none text-sidebar-foreground group-hover:text-primary transition-colors">
                Arthur Silva
              </span>
              <span className="text-[11px] text-sidebar-foreground/50 mt-1.5 truncate">
                Administrador
              </span>
            </div>
          </div>
          <button className="text-sidebar-foreground/40 hover:text-sidebar-foreground transition-colors p-1 rounded hover:bg-sidebar-accent">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
