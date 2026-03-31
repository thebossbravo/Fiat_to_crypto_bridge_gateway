import { Outlet } from 'react-router'
import { useTheme } from '@/contexts/theme-context'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Sun, Moon } from 'lucide-react'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from '../app-sidebar'

export function MainLayout() {
  const { theme, toggleTheme } = useTheme()

  return (
    <SidebarProvider>
      <AppSidebar side="left" />
      <SidebarInset className={theme === 'dark' ? 'bg-black' : 'bg-white'}>
        <header className={`flex h-14 shrink-0 items-center gap-2 border-b px-4 ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
          <SidebarTrigger className={theme === 'dark' ? 'text-white hover:bg-white/10' : 'text-gray-900 hover:bg-gray-100'} />
          <Separator orientation="vertical" className={`mr-2 h-4 ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`} />
          <div className="ml-auto flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className={theme === 'dark' ? 'border-white/20 text-white hover:bg-white/10' : 'border-gray-300 text-gray-900 hover:bg-gray-100'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
