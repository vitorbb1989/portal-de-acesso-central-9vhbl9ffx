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
  SidebarMenuSkeleton,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/stores/main'

export function AppSidebar() {
  const location = useLocation()
  const { isLoading, branding } = useAppStore()

  const navItems = [
    { title: 'Visão Geral', url: '/', icon: LayoutDashboard },
    { title: 'Plataformas', url: '/platforms', icon: Grid },
    { title: 'Logs de Acesso', url: '/logs', icon: History },
    { title: 'Configurações', url: '/settings', icon: Settings },
  ]

  return (
    <Sidebar variant="sidebar" className="border-r border-sidebar-border">
      <SidebarHeader className="p-5 border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-1">
          {branding?.iconUrl ? (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 p-1 shadow-[0_0_12px_rgba(255,255,255,0.1)] border border-white/20">
              <img
                src={branding.iconUrl}
                alt={branding?.name || 'Icon'}
                className="h-full w-full object-contain drop-shadow-md"
              />
            </div>
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-[0_0_12px_rgba(0,102,255,0.4)]">
              <Command className="h-5 w-5" strokeWidth={2.5} />
            </div>
          )}

          <div className="flex flex-col overflow-hidden group-data-[collapsible=icon]:hidden">
            {branding?.logoUrl ? (
              <img
                src={branding.logoUrl}
                alt={branding?.name || 'Logo'}
                className="h-7 w-auto object-left object-contain"
              />
            ) : (
              <>
                <span className="text-base font-bold tracking-tight text-sidebar-foreground truncate">
                  {branding?.name || 'AntropIA'}
                </span>
                <span className="text-[11px] text-sidebar-foreground/70 font-semibold tracking-wide uppercase mt-0.5 truncate">
                  {branding?.subtitle || 'Portal Central'}
                </span>
              </>
            )}
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 pt-6">
        <SidebarMenu>
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <SidebarMenuItem key={i}>
                  <SidebarMenuSkeleton showIcon className="h-10 mb-1 rounded-md" />
                </SidebarMenuItem>
              ))
            : navItems.map((item) => {
                const isActive = location.pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={cn(
                        'h-10 transition-all duration-200 rounded-md mb-1 relative group/menu-btn',
                        isActive
                          ? 'bg-primary/15 text-white font-medium before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-2/3 before:w-[3px] before:bg-primary before:rounded-r-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]'
                          : 'text-sidebar-foreground/70 hover:text-white hover:bg-sidebar-accent',
                      )}
                    >
                      <Link to={item.url} className="flex items-center gap-3 px-2 w-full">
                        <item.icon
                          className={cn(
                            'h-[18px] w-[18px] transition-colors',
                            isActive
                              ? 'text-primary'
                              : 'text-sidebar-foreground/50 group-hover/menu-btn:text-sidebar-foreground',
                          )}
                          strokeWidth={isActive ? 2.5 : 2}
                        />
                        <span className={cn('text-sm', isActive ? 'font-semibold' : 'font-medium')}>
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center justify-between rounded-lg p-2.5 hover:bg-sidebar-accent transition-colors cursor-pointer group border border-transparent hover:border-sidebar-border/50">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border border-sidebar-border">
              <AvatarImage
                src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=1"
                alt="User"
              />
              <AvatarFallback>AS</AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold leading-none text-sidebar-foreground group-hover:text-white transition-colors">
                Arthur Silva
              </span>
              <span className="text-[11px] font-medium text-sidebar-foreground/60 mt-1.5 truncate">
                Administrador
              </span>
            </div>
          </div>
          <button className="text-sidebar-foreground/40 hover:text-white transition-colors p-1.5 rounded hover:bg-sidebar-background">
            <LogOut className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
