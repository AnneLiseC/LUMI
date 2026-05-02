'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      toast.error('Email ou mot de passe incorrect.')
      setLoading(false)
      return
    }
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single()
    const redirects: Record<string, string> = { student: '/eleve', parent: '/parent', teacher: '/professeur', admin: '/admin' }
    toast.success('Bienvenue dans LUMI ! 🌟')
    router.push(redirects[profile?.role ?? 'student'])
    router.refresh()
  }

  const fillDemo = (e: string, p: string) => { setEmail(e); setPassword(p) }

  return (
    <div className="min-h-screen bg-lumi-cream dark:bg-transparent flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-lumi-purple/20 dark:bg-lumi-purple/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-lumi-blue/20 dark:bg-lumi-blue/10 blur-3xl" />
      </div>

      <div className="absolute top-6 right-6"><ThemeToggle /></div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md space-y-6 relative z-10"
      >
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-lumi-purple to-lumi-blue flex items-center justify-center shadow-glow">
              <span className="text-white font-black text-2xl">L</span>
            </div>
            <span className="text-3xl font-black text-lumi-text dark:text-slate-100 tracking-tight">LUMI</span>
          </Link>
          <h1 className="text-2xl font-black text-lumi-text dark:text-slate-100">Connexion</h1>
          <p className="text-lumi-muted dark:text-slate-400 mt-1">Reprends là où tu t'es arrêté·e !</p>
        </div>

        {/* Form card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-card dark:shadow-card-dark border border-slate-100 dark:border-slate-800 p-8 space-y-5">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-black text-lumi-text dark:text-slate-200 block">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="ton@email.fr" className="lumi-input" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-black text-lumi-text dark:text-slate-200 block">Mot de passe</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" className="lumi-input" />
            </div>
            <Button type="submit" loading={loading} className="w-full" size="lg">
              Se connecter 🚀
            </Button>
          </form>
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4 text-center">
            <p className="text-sm text-lumi-muted dark:text-slate-400">
              Pas encore de compte ?{' '}
              <Link href="/register" className="text-lumi-purple font-black hover:underline">Créer un compte</Link>
            </p>
          </div>
        </div>

        {/* Demo accounts */}
        <div className="bg-white/60 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-slate-200 dark:border-white/10">
          <p className="text-xs font-black text-lumi-muted dark:text-slate-400 mb-3 text-center uppercase tracking-wide">Comptes de démo</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: '🧒 Élève', email: 'eleve@lumi.app', password: 'Lumi2024!' },
              { label: '👨‍👩‍👧 Parent', email: 'parent@lumi.app', password: 'Lumi2024!' },
              { label: '👨‍🏫 Professeur', email: 'annelisecaillet05@gmail.com', password: 'Lumi2024!' },
              { label: '⚙️ Admin', email: 'admin@lumi.app', password: 'Lumi2024!' },
            ].map(a => (
              <button
                key={a.email}
                onClick={() => fillDemo(a.email, a.password)}
                className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-lumi-purple hover:bg-lumi-purple-light dark:hover:bg-lumi-purple/10 transition-all text-left dark:text-slate-300"
              >
                <span className="block font-black">{a.label}</span>
                <span className="text-lumi-muted dark:text-slate-500 block truncate">{a.email}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
