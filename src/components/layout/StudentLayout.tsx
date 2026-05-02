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
import { Home, Map, LogOut, Star } from 'lucide-react'
import { motion } from 'framer-motion'

interface StudentLayoutProps {
  children: React.ReactNode
  student?: { xp: number; level: number }
}

function LumiLogo() {
  return (
    <Link href="/eleve" className="flex items-center gap-2 flex-shrink-0">
      <div className="w-9 h-9 rounded-xl lumi-logo-gradient flex items-center justify-center shadow-lg animate-logo-glow">
        <span className="text-white font-black text-xl">L</span>
      </div>
      <span className="font-black text-xl bg-gradient-to-r from-lumi-purple via-lumi-blue to-cyan-500 bg-clip-text text-transparent hidden sm:block">
        LUMI
      </span>
    </Link>
  )
}

const navItems = [
  { href: '/eleve', label: 'Accueil', icon: Home },
  { href: '/eleve/parcours', label: 'Mon parcours', icon: Map },
  { href: '/eleve/projet', label: 'Mon projet', icon: Star },
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
        'min-h-screen bg-lumi-cream dark:bg-gray-950',
        profile?.dyslexia_mode && 'font-dyslexia tracking-wide leading-relaxed'
      )}
    >
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-b border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-4">
          <LumiLogo />

          {student && (
            <div className="flex-1 max-w-xs">
              <XPBar xp={student.xp} compact />
            </div>
          )}

          <div className="ml-auto flex items-center gap-1">
            <ThemeToggle />
            {profile && (
              <DyslexiaToggle enabled={profile.dyslexia_mode} onToggle={toggleDyslexiaMode} />
            )}
            <button
              onClick={signOut}
              className="p-2 rounded-xl text-lumi-muted hover:text-red-500 hover:bg-red-50 transition-colors"
              title="Se déconnecter"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Bottom Nav (mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shadow-lg sm:hidden">
        <div className="flex">
          {navItems.map(item => {
            const Icon = item.icon
            const active = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex-1 flex flex-col items-center gap-0.5 py-3 text-xs font-semibold transition-colors',
                  active ? 'text-lumi-blue' : 'text-lumi-muted'
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Sidebar (desktop) with Framer Motion stagger */}
      <aside className="hidden sm:fixed sm:left-0 sm:top-16 sm:h-[calc(100vh-4rem)] sm:w-56 sm:flex sm:flex-col sm:bg-white dark:sm:bg-gray-900 sm:border-r sm:border-gray-100 dark:sm:border-gray-800 sm:p-4 sm:gap-2">
        {navItems.map((item, i) => {
          const Icon = item.icon
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08, duration: 0.3, ease: 'easeOut' }}
            >
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all text-sm',
                  active
                    ? 'bg-lumi-blue-light text-lumi-blue dark:bg-blue-950 dark:text-blue-400'
                    : 'text-lumi-muted hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-lumi-text'
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {item.label}
              </Link>
            </motion.div>
          )
        })}

        <div className="mt-auto">
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
      <main className="sm:pl-56 pb-20 sm:pb-8">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {children}
        </div>
      </main>
    </div>
  )
}
