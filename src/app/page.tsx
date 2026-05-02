'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { motion } from 'framer-motion'

const features = [
  { emoji: '💻', label: 'Ordinateur', color: 'from-lumi-blue/20 to-lumi-blue/5 border-lumi-blue/30' },
  { emoji: '🤖', label: 'Intelligence IA', color: 'from-lumi-purple/20 to-lumi-purple/5 border-lumi-purple/30' },
  { emoji: '🧩', label: 'Logique', color: 'from-lumi-cyan/20 to-lumi-cyan/5 border-lumi-cyan/30' },
  { emoji: '⭐', label: 'XP & Badges', color: 'from-lumi-yellow/20 to-lumi-yellow/5 border-lumi-yellow/30' },
]

const tags = [
  '✅ Adapté TDAH & Dys',
  '🔒 Sécurisé',
  '👨‍🏫 Suivi professeur',
  '👨‍👩‍👧 Espace parent',
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-lumi-cream dark:bg-transparent flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-lumi-purple/20 dark:bg-lumi-purple/10 blur-3xl animate-float" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-lumi-blue/20 dark:bg-lumi-blue/10 blur-3xl animate-float animation-delay-400" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-lumi-cyan/10 blur-3xl animate-pulse-slow" />
      </div>

      {/* Theme toggle */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="max-w-2xl w-full text-center space-y-8 relative z-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
          className="flex items-center justify-center gap-4"
        >
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-lumi-purple via-lumi-blue to-lumi-cyan flex items-center justify-center shadow-glow animate-glow-pulse">
            <span className="text-white font-black text-4xl">L</span>
          </div>
          <div className="text-left">
            <h1 className="text-5xl font-black text-lumi-text dark:text-slate-100 tracking-tight">LUMI</h1>
            <p className="text-lumi-muted dark:text-slate-400 font-semibold text-lg">Apprends à ta façon.</p>
          </div>
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <p className="text-2xl font-black text-lumi-text dark:text-slate-100">
            Avance à ton rythme. 🚀
          </p>
          <p className="text-lumi-muted dark:text-slate-400 text-lg leading-relaxed max-w-lg mx-auto">
            Une application éducative pensée pour les enfants de 8–12 ans.
            Apprends l'informatique, l'IA, et crée ton propre outil d'aide aux devoirs.
          </p>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {features.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.08 }}
              whileHover={{ y: -6, scale: 1.04 }}
              className={`bg-gradient-to-b ${f.color} rounded-2xl p-4 border text-center backdrop-blur-sm`}
            >
              <div className="text-3xl mb-2 animate-float" style={{ animationDelay: `${i * 0.3}s` }}>
                {f.emoji}
              </div>
              <p className="text-sm font-black text-lumi-text dark:text-slate-200">{f.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link href="/login">
            <Button size="lg" className="w-full sm:w-auto">
              Se connecter 🚀
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="ghost" size="lg" className="w-full sm:w-auto">
              Créer un compte
            </Button>
          </Link>
        </motion.div>

        {/* Trust tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75 }}
          className="flex flex-wrap gap-2 justify-center"
        >
          {tags.map(tag => (
            <span
              key={tag}
              className="px-3 py-1.5 bg-white/70 dark:bg-white/5 backdrop-blur-sm rounded-xl font-semibold text-sm text-lumi-muted dark:text-slate-400 border border-slate-200 dark:border-white/10"
            >
              {tag}
            </span>
          ))}
        </motion.div>
      </div>
    </main>
  )
}
