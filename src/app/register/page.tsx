'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { UserRole } from '@/types'
import { motion } from 'framer-motion'

const ROLES: { value: UserRole; label: string; emoji: string; description: string }[] = [
  { value: 'student', label: 'Élève', emoji: '🧒', description: 'J\'apprends avec LUMI' },
  { value: 'parent', label: 'Parent', emoji: '👨‍👩‍👧', description: 'Je suis la progression de mon enfant' },
  { value: 'teacher', label: 'Professeur', emoji: '👨‍🏫', description: 'J\'accompagne mes élèves' },
]

export default function RegisterPage() {
  const [role, setRole] = useState<UserRole>('student')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) {
      toast.error('Le mot de passe doit faire au moins 8 caractères.')
      return
    }
    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, last_name: lastName, role },
      },
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        role,
        first_name: firstName,
        last_name: lastName,
      })

      if (role === 'student') {
        await supabase.from('students').insert({
          profile_id: data.user.id,
          xp: 0,
          level: 1,
        })
      }

      toast.success('Compte créé ! Bienvenue dans LUMI 🌟')
      const redirects: Record<UserRole, string> = {
        student: '/eleve',
        parent: '/parent',
        teacher: '/professeur',
        admin: '/admin',
      }
      router.push(redirects[role])
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lumi-green-light via-lumi-cream to-lumi-blue-light dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated blobs */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-lumi-green rounded-full opacity-20 blur-3xl animate-blob pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-lumi-blue rounded-full opacity-20 blur-3xl animate-blob pointer-events-none" style={{ animationDelay: '3s' }} />

      {/* Theme toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <motion.div
        className="w-full max-w-md space-y-6 relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl lumi-logo-gradient flex items-center justify-center shadow-lg animate-logo-glow">
              <span className="text-white font-black text-2xl">L</span>
            </div>
            <span className="text-3xl font-black bg-gradient-to-r from-lumi-purple via-lumi-blue to-cyan-500 bg-clip-text text-transparent">LUMI</span>
          </Link>
          <h1 className="text-2xl font-black text-lumi-text dark:text-gray-100">Créer un compte</h1>
          <p className="text-lumi-muted mt-1">Rejoins l&apos;aventure LUMI !</p>
        </div>

        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 p-8 space-y-6">
          {/* Role selector */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-lumi-text block">Je suis…</label>
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map(r => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  className={cn(
                    'p-3 rounded-2xl border-2 text-center transition-all',
                    role === r.value
                      ? 'border-lumi-blue bg-lumi-blue-light'
                      : 'border-gray-200 hover:border-lumi-blue'
                  )}
                >
                  <div className="text-2xl mb-1">{r.emoji}</div>
                  <div className="text-xs font-bold text-lumi-text">{r.label}</div>
                </button>
              ))}
            </div>
            <p className="text-xs text-lumi-muted text-center">
              {ROLES.find(r => r.value === role)?.description}
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-lumi-text block">Prénom</label>
                <input
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  required
                  placeholder="Léa"
                  className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-base focus:outline-none focus:border-lumi-blue transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-lumi-text block">Nom</label>
                <input
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  required
                  placeholder="Martin"
                  className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-base focus:outline-none focus:border-lumi-blue transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-lumi-text block">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="ton@email.fr"
                className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-base focus:outline-none focus:border-lumi-blue transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-lumi-text block">
                Mot de passe
                <span className="text-lumi-muted font-normal ml-2">(8 caractères min.)</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={8}
                placeholder="••••••••"
                className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-base focus:outline-none focus:border-lumi-blue transition-colors"
              />
            </div>

            <Button type="submit" loading={loading} className="w-full" size="lg">
              Créer mon compte 🚀
            </Button>
          </form>

          <div className="text-center border-t border-gray-100 pt-4">
            <p className="text-sm text-lumi-muted">
              Déjà un compte ?{' '}
              <Link href="/login" className="text-lumi-blue font-bold hover:underline">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
