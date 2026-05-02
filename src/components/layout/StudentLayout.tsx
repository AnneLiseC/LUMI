'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { XPBar } from '@/components/ui/XPBar'
import { DyslexiaToggle } from '@/components/ui/DyslexiaToggle'
import { useProfile } from '@/hooks/useProfile'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Home, Map, FolderOpen, LogOut, Star } from 'lucide-react'

interface StudentLayoutProps {
  children: React.ReactNode
  student?: { xp: number; level: number }
}

export function StudentLayout({ children, student }: StudentLayoutProps) {
  const pathname = usePathname()
  const { profile, toggleDyslexiaMode } = useProfile()
  const router = useRouter()
  const supabase = createClient()

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const navItems = [
    { href: '/eleve', label: 'Accueil', icon: Home },
    { href: '/eleve/parcours', label: 'Mon parcours', icon: Map },
    { href: '/eleve/projet', label: 'Mon projet', icon: Star },
  ]

  return (
    <div
      className={cn(
        'min-h-screen bg-lumi-cream',
        profile?.dyslexia_mode && 'font-dyslexia tracking-wide leading-relaxed'
      )}
    >
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/eleve" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-lumi-blue flex items-center justify-center text-white font-black text-lg shadow-sm">
              L
            </div>
            <span className="font-black text-lumi-text text-lg hidden sm:block">LUMI</span>
          </Link>

          {student && (
            <div className="flex-1 max-w-xs">
              <XPBar xp={student.xp} compact />
            </div>
          )}

          <div className="ml-auto flex items-center gap-2">
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
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-lg sm:hidden">
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

      {/* Sidebar (desktop) */}
      <aside className="hidden sm:fixed sm:left-0 sm:top-16 sm:h-[calc(100vh-4rem)] sm:w-56 sm:flex sm:flex-col sm:bg-white sm:border-r sm:border-gray-100 sm:p-4 sm:gap-2">
        {navItems.map(item => {
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
