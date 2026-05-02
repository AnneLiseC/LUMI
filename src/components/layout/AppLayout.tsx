'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut, Users, BookOpen, BarChart3, Settings } from 'lucide-react'

interface AppLayoutProps {
  children: React.ReactNode
  role: 'parent' | 'teacher' | 'admin'
  userName?: string
  navItems?: { href: string; label: string; icon: React.ElementType }[]
}

const defaultNavItems = {
  parent: [
    { href: '/parent', label: 'Tableau de bord', icon: BarChart3 },
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

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-lumi-cream flex">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-100 flex flex-col shadow-sm min-h-screen sticky top-0">
        <div className={cn('p-5 text-white', roleColors[role])}>
          <div className="font-black text-2xl">LUMI</div>
          <div className="text-sm opacity-90 font-semibold">{roleLabels[role]}</div>
          {userName && (
            <div className="text-xs opacity-75 mt-1">Bonjour, {userName} !</div>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {items.map(item => {
            const Icon = item.icon
            const active = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
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
      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
