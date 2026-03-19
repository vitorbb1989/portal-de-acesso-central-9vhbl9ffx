import { Outlet } from 'react-router-dom'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import { AppHeader } from './AppHeader'

export default function Layout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset className="bg-background min-h-screen flex flex-col relative">
        <AppHeader />
        {/* AntropIA Brand identity signature */}
        <div className="h-[2px] w-full bg-gradient-to-r from-primary via-primary/60 to-transparent absolute top-16 left-0 z-30 shadow-[0_1px_12px_rgba(0,102,255,0.4)]" />
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pt-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
