'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { XPBar } from '@/components/ui/XPBar'
import { DyslexiaToggle } from '@/components/ui/DyslexiaToggle'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useProfile } from '@/hooks/useProfile'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Home, Map, Star, LogOut } from 'lucide-react'
import { motion } from 'framer-motion'

interface StudentLayoutProps {
  children: React.ReactNode
  student?: { xp: number; level: number }
}

const navItems = [
  { href: '/eleve', label: 'Accueil', icon: Home },
  { href: '/eleve/parcours', label: 'Parcours', icon: Map },
  { href: '/eleve/projet', label: 'Projet', icon: Star },
]

export function StudentLayout({ children, student }: StudentLayoutProps) {
  const pathname = usePathname()
  const { profile, toggleDyslexiaMode } = useProfile()
  const router = useRouter()
  const supabase = createClient()

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div
      className={cn(
        'min-h-screen bg-lumi-cream dark:bg-transparent',
        profile?.dyslexia_mode && 'font-dyslexia'
      )}
    >
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/eleve" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-lumi-purple to-lumi-blue flex items-center justify-center text-white font-black text-lg shadow-glow">
              L
            </div>
            <span className="font-black text-lumi-text dark:text-slate-100 text-lg hidden sm:block tracking-tight">
              LUMI
            </span>
          </Link>

          {student && (
            <div className="flex-1 max-w-xs">
              <XPBar xp={student.xp} compact />
            </div>
          )}

          <div className="ml-auto flex items-center gap-1">
            {profile && (
              <DyslexiaToggle enabled={profile.dyslexia_mode} onToggle={toggleDyslexiaMode} />
            )}
            <ThemeToggle />
            <button
              onClick={signOut}
              className="p-2 rounded-xl text-lumi-muted dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              title="Se déconnecter"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Bottom Nav (mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 sm:hidden">
        <div className="flex">
          {navItems.map(item => {
            const Icon = item.icon
            const active = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex-1 flex flex-col items-center gap-0.5 py-3 text-xs font-bold transition-colors',
                  active
                    ? 'text-lumi-purple dark:text-lumi-purple'
                    : 'text-lumi-muted dark:text-slate-400'
                )}
              >
                <Icon className={cn('w-5 h-5', active && 'drop-shadow-[0_0_6px_rgba(167,139,250,0.8)]')} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Sidebar (desktop) */}
      <aside className="hidden sm:fixed sm:left-0 sm:top-[60px] sm:h-[calc(100vh-60px)] sm:w-56 sm:flex sm:flex-col sm:bg-white dark:sm:bg-slate-900 sm:border-r sm:border-slate-100 dark:sm:border-slate-800 sm:p-4 sm:gap-1 z-40">
        {navItems.map((item, i) => {
          const Icon = item.icon
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -12 }}
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
                <Icon className={cn('w-5 h-5 flex-shrink-0', active && 'drop-shadow-[0_0_6px_rgba(167,139,250,0.8)]')} />
                {item.label}
              </Link>
            </motion.div>
          )
        })}

        <div className="mt-auto">
          <button
            onClick={signOut}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-lumi-muted dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400 transition-all text-sm font-bold w-full"
          >
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="sm:pl-56 pb-20 sm:pb-8">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {children}
        </div>
      </main>
    </div>
  )
}
