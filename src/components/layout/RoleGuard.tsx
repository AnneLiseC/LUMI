'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { UserRole } from '@/types'

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: UserRole[]
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const [checking, setChecking] = useState(true)
  const [allowed, setAllowed] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function check() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!profile || !allowedRoles.includes(profile.role as UserRole)) {
        const redirects: Record<string, string> = {
          student: '/eleve',
          parent: '/parent',
          teacher: '/professeur',
          admin: '/admin',
        }
        router.push(redirects[profile?.role ?? 'student'] ?? '/login')
        return
      }

      setAllowed(true)
      setChecking(false)
    }
    check()
  }, [])

  if (checking) {
    return (
      <div className="min-h-screen bg-lumi-cream flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-lumi-blue flex items-center justify-center mx-auto animate-pulse">
            <span className="text-white font-black text-2xl">L</span>
          </div>
          <p className="text-lumi-muted font-semibold">Chargement de LUMI…</p>
        </div>
      </div>
    )
  }

  if (!allowed) return null
  return <>{children}</>
}
