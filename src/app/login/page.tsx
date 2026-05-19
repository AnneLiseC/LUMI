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

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    const redirects: Record<string, string> = {
      student: '/eleve',
      parent: '/parent',
      teacher: '/professeur',
      admin: '/admin',
    }

    toast.success('Bienvenue dans LUMI ! 🌟')
    router.push(redirects[profile?.role ?? 'student'])
    router.refresh()
  }

  const fillDemo = (email: string, password: string) => {
    setEmail(email)
    setPassword(password)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lumi-blue-light via-lumi-cream to-lumi-purple-light dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-lumi-purple rounded-full opacity-20 blur-3xl animate-blob pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-lumi-blue rounded-full opacity-20 blur-3xl animate-blob pointer-events-none" style={{ animationDelay: '3s' }} />

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
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl lumi-logo-gradient flex items-center justify-center shadow-lg animate-logo-glow">
              <span className="text-white font-black text-2xl">L</span>
            </div>
            <span className="text-3xl font-black bg-gradient-to-r from-lumi-purple via-lumi-blue to-cyan-500 bg-clip-text text-transparent">
              LUMI
            </span>
          </Link>
          <h1 className="text-2xl font-black text-lumi-text dark:text-gray-100">Connexion</h1>
          <p className="text-lumi-muted mt-1">Continue où tu t&apos;es arrêté·e !</p>
        </div>

        {/* Form */}
        <motion.div
          className="bg-white/90 dark:bg-gray-900/90 backdrop-blur rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 p-8 space-y-5"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-lumi-text dark:text-gray-200 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="ton@email.fr"
                className="w-full border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-2xl px-4 py-3 text-base focus:outline-none focus:border-lumi-blue transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-lumi-text dark:text-gray-200 block">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-2xl px-4 py-3 text-base focus:outline-none focus:border-lumi-blue transition-colors"
              />
            </div>
            <Button type="submit" loading={loading} className="w-full" size="lg">
              Se connecter 🚀
            </Button>
          </form>

          <div className="border-t border-gray-100 dark:border-gray-800 pt-4 text-center">
            <p className="text-sm text-lumi-muted">
              Pas encore de compte ?{' '}
              <Link href="/register" className="text-lumi-blue font-bold hover:underline">
                Créer un compte
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Demo accounts */}
        <motion.div
          className="bg-white/80 dark:bg-gray-900/80 backdrop-blur rounded-2xl p-4 border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <p className="text-xs font-bold text-lumi-muted mb-3 text-center">Comptes de démonstration</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: '🧒 Élève', email: 'eleve@lumi.app', password: 'Lumi2024!' },
              { label: '👨‍👩‍👧 Parent', email: 'parent@lumi.app', password: 'Lumi2024!' },
              { label: '👨‍🏫 Professeur', email: 'annelisecaillet05@gmail.com', password: 'Lumi2024!' },
              { label: '⚙️ Admin', email: 'admin@lumi.app', password: 'Lumi2024!' },
            ].map(account => (
              <button
                key={account.email}
                onClick={() => fillDemo(account.email, account.password)}
                className="text-xs font-semibold px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-lumi-blue hover:bg-lumi-blue-light dark:hover:bg-blue-950 transition-all text-left"
              >
                <span className="block">{account.label}</span>
                <span className="text-lumi-muted block truncate">{account.email}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
