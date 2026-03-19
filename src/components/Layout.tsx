import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import { AppHeader } from './AppHeader'
import { useAppStore } from '@/stores/main'

export default function Layout() {
  const { branding } = useAppStore()

  useEffect(() => {
    if (branding?.faviconUrl) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']")
      if (!link) {
        link = document.createElement('link')
        link.rel = 'icon'
        document.head.appendChild(link)
      }
      link.href = branding.faviconUrl
    }
  }, [branding?.faviconUrl])

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset className="bg-background min-h-screen flex flex-col relative">
        {/* Brand Signature Detail Line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent z-50 pointer-events-none" />

        <AppHeader />

        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto w-full pt-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
