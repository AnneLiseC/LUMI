'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import type { UserRole } from '@/types'

const ROLES: { value: UserRole; label: string; emoji: string; description: string }[] = [
  { value: 'student', label: 'Élève', emoji: '🧒', description: "J'apprends avec LUMI" },
  { value: 'parent', label: 'Parent', emoji: '👨‍👩‍👧', description: 'Je suis la progression de mon enfant' },
  { value: 'teacher', label: 'Professeur', emoji: '👨‍🏫', description: "J'accompagne mes élèves" },
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
    if (password.length < 8) { toast.error('Le mot de passe doit faire au moins 8 caractères.'); return }
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { first_name: firstName, last_name: lastName, role } },
    })
    if (error) { toast.error(error.message); setLoading(false); return }
    if (data.user) {
      await supabase.from('profiles').insert({ id: data.user.id, role, first_name: firstName, last_name: lastName })
      if (role === 'student') await supabase.from('students').insert({ profile_id: data.user.id, xp: 0, level: 1 })
      toast.success('Compte créé ! Bienvenue dans LUMI 🌟')
      const redirects: Record<UserRole, string> = { student: '/eleve', parent: '/parent', teacher: '/professeur', admin: '/admin' }
      router.push(redirects[role])
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-lumi-cream dark:bg-transparent flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-lumi-green/20 dark:bg-lumi-green/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-lumi-blue/20 dark:bg-lumi-blue/10 blur-3xl" />
      </div>

      <div className="absolute top-6 right-6"><ThemeToggle /></div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md space-y-6 relative z-10"
      >
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-lumi-purple to-lumi-blue flex items-center justify-center shadow-glow">
              <span className="text-white font-black text-2xl">L</span>
            </div>
            <span className="text-3xl font-black text-lumi-text dark:text-slate-100 tracking-tight">LUMI</span>
          </Link>
          <h1 className="text-2xl font-black text-lumi-text dark:text-slate-100">Créer un compte</h1>
          <p className="text-lumi-muted dark:text-slate-400 mt-1">Rejoins l'aventure LUMI !</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-card dark:shadow-card-dark border border-slate-100 dark:border-slate-800 p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-black text-lumi-text dark:text-slate-200 block">Je suis…</label>
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map(r => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  className={cn(
                    'p-3 rounded-2xl border-2 text-center transition-all',
                    role === r.value
                      ? 'border-lumi-purple bg-lumi-purple-light dark:bg-lumi-purple/20 shadow-glow'
                      : 'border-slate-200 dark:border-slate-700 hover:border-lumi-purple dark:hover:border-lumi-purple/50'
                  )}
                >
                  <div className="text-2xl mb-1">{r.emoji}</div>
                  <div className="text-xs font-black text-lumi-text dark:text-slate-200">{r.label}</div>
                </button>
              ))}
            </div>
            <p className="text-xs text-lumi-muted dark:text-slate-400 text-center">
              {ROLES.find(r => r.value === role)?.description}
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-black text-lumi-text dark:text-slate-200 block">Prénom</label>
                <input value={firstName} onChange={e => setFirstName(e.target.value)} required placeholder="Léa" className="lumi-input" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-black text-lumi-text dark:text-slate-200 block">Nom</label>
                <input value={lastName} onChange={e => setLastName(e.target.value)} required placeholder="Martin" className="lumi-input" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-black text-lumi-text dark:text-slate-200 block">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="ton@email.fr" className="lumi-input" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-black text-lumi-text dark:text-slate-200 block">
                Mot de passe <span className="text-lumi-muted font-normal text-xs">(8 car. min.)</span>
              </label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} placeholder="••••••••" className="lumi-input" />
            </div>
            <Button type="submit" loading={loading} className="w-full" size="lg">Créer mon compte 🚀</Button>
          </form>

          <div className="text-center border-t border-slate-100 dark:border-slate-800 pt-4">
            <p className="text-sm text-lumi-muted dark:text-slate-400">
              Déjà un compte ?{' '}
              <Link href="/login" className="text-lumi-purple font-black hover:underline">Se connecter</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
