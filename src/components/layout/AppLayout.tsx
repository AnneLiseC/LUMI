'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut, Users, BookOpen, BarChart3, Settings, GraduationCap } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { motion } from 'framer-motion'

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

const roleGradients = {
  parent: 'from-lumi-green to-lumi-cyan',
  teacher: 'from-lumi-purple to-lumi-blue',
  admin: 'from-red-400 to-orange-400',
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
    <div className="min-h-screen bg-lumi-cream dark:bg-transparent flex">
      <aside className="w-64 flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col shadow-card dark:shadow-card-dark min-h-screen sticky top-0 z-40">
        <div className={cn('p-5 text-white bg-gradient-to-br', roleGradients[role])}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-black text-xl">
              L
            </div>
            <div>
              <div className="font-black text-xl tracking-tight">LUMI</div>
              <div className="text-xs opacity-80 font-semibold">{roleLabels[role]}</div>
            </div>
          </div>
          {userName && (
            <div className="mt-3 text-sm opacity-80 font-semibold">Bonjour, {userName} 👋</div>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {items.map((item, i) => {
            const Icon = item.icon
            const active = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all text-sm',
                    active
                      ? 'bg-lumi-purple-light text-lumi-purple dark:bg-lumi-purple/20 dark:text-lumi-purple'
                      : 'text-lumi-muted dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-lumi-text dark:hover:text-slate-100'
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {item.label}
                  {active && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-lumi-purple" />
                  )}
                </Link>
              </motion.div>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <button
            onClick={signOut}
            className="flex-1 flex items-center gap-3 px-4 py-3 rounded-2xl text-lumi-muted dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400 transition-all text-sm font-bold"
          >
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
          <ThemeToggle />
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
