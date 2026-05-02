'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut, Users, BookOpen, BarChart3, Settings, GraduationCap, Menu, X } from 'lucide-react'

interface AppLayoutProps {
  children: React.ReactNode
  role: 'parent' | 'teacher' | 'admin'
  userName?: string
  navItems?: { href: string; label: string; icon: React.ElementType }[]
}

const defaultNavItems = {
  parent: [
    { href: '/parent', label: 'Tableau de bord', icon: BarChart3 },
    { href: '/parent/programme', label: 'Programme', icon: GraduationCap },
  ],
  teacher: [
    { href: '/professeur', label: 'Mes élèves', icon: Users },
    { href: '/professeur/programme', label: 'Programme', icon: BookOpen },
  ],
  admin: [
    { href: '/admin', label: 'Administration', icon: Settings },
  ],
}

const roleColors = {
  parent: 'bg-lumi-green',
  teacher: 'bg-lumi-purple',
  admin: 'bg-red-400',
}

const roleLabels = {
  parent: 'Espace Parent',
  teacher: 'Espace Professeur',
  admin: 'Administration',
}

export function AppLayout({ children, role, userName, navItems }: AppLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const items = navItems ?? defaultNavItems[role]
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className="min-h-screen bg-lumi-cream">
      {/* Mobile header */}
      <header className={cn('md:hidden sticky top-0 z-40 text-white shadow-sm', roleColors[role])}>
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 transition-colors flex-shrink-0"
            aria-label="Ouvrir le menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="font-black text-xl">LUMI</div>
          <div className="text-sm opacity-90 font-semibold truncate">{roleLabels[role]}</div>
        </div>
      </header>

      {/* Backdrop overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      <div className="md:flex md:min-h-screen">
        {/* Sidebar */}
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 flex flex-col shadow-sm',
            'transition-transform duration-300',
            'md:static md:sticky md:top-0 md:h-screen md:flex-shrink-0 md:translate-x-0 md:z-auto md:transition-none',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className={cn('p-5 text-white flex items-center justify-between', roleColors[role])}>
            <div>
              <div className="font-black text-2xl">LUMI</div>
              <div className="text-sm opacity-90 font-semibold">{roleLabels[role]}</div>
              {userName && (
                <div className="text-xs opacity-75 mt-1">Bonjour, {userName} !</div>
              )}
            </div>
            <button
              onClick={closeSidebar}
              className="md:hidden p-1.5 rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
              aria-label="Fermer le menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {items.map(item => {
              const Icon = item.icon
              const active = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeSidebar}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all text-sm',
                    active
                      ? 'bg-lumi-blue-light text-lumi-blue'
                      : 'text-lumi-muted hover:bg-gray-50 hover:text-lumi-text'
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t border-gray-100">
            <button
              onClick={signOut}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-lumi-muted hover:bg-red-50 hover:text-red-500 transition-all text-sm font-semibold w-full"
            >
              <LogOut className="w-5 h-5" />
              Se déconnecter
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
