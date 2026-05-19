'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { motion } from 'framer-motion'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-lumi-blue-light via-lumi-cream to-lumi-purple-light dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated blobs */}
      <div className="absolute top-0 -left-24 w-96 h-96 bg-lumi-purple rounded-full opacity-20 blur-3xl animate-blob pointer-events-none" />
      <div className="absolute top-0 -right-24 w-96 h-96 bg-lumi-blue rounded-full opacity-20 blur-3xl animate-blob blob-delay pointer-events-none" style={{ animationDelay: '2s' }} />
      <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-cyan-400 rounded-full opacity-15 blur-3xl animate-blob pointer-events-none" style={{ animationDelay: '4s' }} />

      {/* Theme toggle top right */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <motion.div
        className="max-w-2xl w-full text-center space-y-8 relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Logo */}
        <motion.div
          className="flex items-center justify-center gap-4"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5, type: 'spring', stiffness: 200 }}
        >
          <div className="w-20 h-20 rounded-3xl lumi-logo-gradient flex items-center justify-center shadow-2xl animate-logo-glow">
            <span className="text-white font-black text-4xl">L</span>
          </div>
          <div className="text-left">
            <h1 className="text-5xl font-black bg-gradient-to-r from-lumi-purple via-lumi-blue to-cyan-500 bg-clip-text text-transparent">
              LUMI
            </h1>
            <p className="text-lumi-muted font-semibold text-lg">Apprends à ta façon.</p>
          </div>
        </motion.div>

        {/* Tagline */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
        >
          <p className="text-2xl font-bold text-lumi-text dark:text-gray-100">
            Avance à ton rythme. 🚀
          </p>
          <p className="text-lumi-muted text-lg leading-relaxed max-w-lg mx-auto">
            Une application éducative pensée pour les enfants de 8–12 ans.
            Apprends à utiliser l'ordinateur, l'IA, et crée ton propre outil d'aide aux devoirs.
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {[
            { emoji: '💻', label: 'Ordinateur' },
            { emoji: '🤖', label: 'Intelligence IA' },
            { emoji: '🧩', label: 'Logique' },
            { emoji: '⭐', label: 'XP & Badges' },
          ].map((f, i) => (
            <motion.div
              key={f.label}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.05, y: -4 }}
            >
              <div className="text-3xl mb-2">{f.emoji}</div>
              <p className="text-sm font-bold text-lumi-text dark:text-gray-200">{f.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Link href="/login">
            <Button size="lg" className="w-full sm:w-auto">
              Se connecter
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="ghost" size="lg" className="w-full sm:w-auto">
              Créer un compte
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </main>
  )
}
