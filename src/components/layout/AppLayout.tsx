'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut, Users, BookOpen, BarChart3, Settings, GraduationCap, Menu, X } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

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
    { href: '/professeur/statistiques', label: 'Statistiques', icon: TrendingUp },
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

function LumiLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-9 rounded-xl lumi-logo-gradient flex items-center justify-center shadow-lg animate-logo-glow flex-shrink-0">
        <span className="text-white font-black text-xl">L</span>
      </div>
      <span className="font-black text-xl bg-gradient-to-r from-lumi-purple via-lumi-blue to-cyan-500 bg-clip-text text-transparent">
        LUMI
      </span>
    </div>
  )
}

export function AppLayout({ children, role, userName, navItems }: AppLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const items = navItems ?? defaultNavItems[role]
  const [drawerOpen, setDrawerOpen] = useState(false)

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const NavLinks = ({ onLinkClick }: { onLinkClick?: () => void }) => (
    <>
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
              onClick={onLinkClick}
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
    </>
  )

  return (
    <div className="min-h-screen bg-lumi-cream dark:bg-transparent">
      {/* Desktop sidebar — hidden on mobile */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 shadow-card dark:shadow-card-dark z-40">
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
          <NavLinks />
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
      </header>

      {/* Mobile header — hidden on lg */}
      <header className="lg:hidden sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-1.5 rounded-xl text-lumi-muted dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Ouvrir le menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className={cn('w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center font-black text-white text-base', roleGradients[role])}>
            L
          </div>
          <span className="font-black text-lumi-text dark:text-slate-100">LUMI</span>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setDrawerOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 w-72 z-50 flex flex-col bg-white dark:bg-slate-900 shadow-2xl lg:hidden"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <div className={cn('p-5 text-white bg-gradient-to-br', roleGradients[role])}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-black text-xl">
                      L
                    </div>
                    <div>
                      <div className="font-black text-xl tracking-tight">LUMI</div>
                      <div className="text-xs opacity-80 font-semibold">{roleLabels[role]}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setDrawerOpen(false)}
                    className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
                    aria-label="Fermer le menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {userName && (
                  <div className="mt-3 text-sm opacity-80 font-semibold">Bonjour, {userName} 👋</div>
                )}
              </div>

              <nav className="flex-1 p-4 space-y-1">
                <NavLinks onLinkClick={() => setDrawerOpen(false)} />
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
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <main className="lg:pl-64">
        <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
