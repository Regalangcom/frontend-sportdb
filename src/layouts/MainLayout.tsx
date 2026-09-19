import { Outlet } from 'react-router-dom'
import { GlobalLoadingBar } from '@/components/layout/GlobalLoadingBar'
import { Navbar } from '@/components/layout/Navbar'

export function MainLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <GlobalLoadingBar />
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        Data by TheSportsDB. Match times shown in WIB (Asia/Jakarta).
      </footer>
    </div>
  )
}
