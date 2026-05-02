import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-lumi-blue-light via-lumi-cream to-lumi-purple-light flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Logo */}
        <div className="flex items-center justify-center gap-4">
          <div className="w-20 h-20 rounded-3xl bg-lumi-blue flex items-center justify-center shadow-xl">
            <span className="text-white font-black text-4xl">L</span>
          </div>
          <div className="text-left">
            <h1 className="text-5xl font-black text-lumi-text">LUMI</h1>
            <p className="text-lumi-muted font-semibold text-lg">Apprends à ta façon.</p>
          </div>
        </div>

        {/* Tagline */}
        <div className="space-y-3">
          <p className="text-2xl font-bold text-lumi-text">
            Avance à ton rythme. 🚀
          </p>
          <p className="text-lumi-muted text-lg leading-relaxed max-w-lg mx-auto">
            Une application éducative pensée pour les enfants de 8–12 ans.
            Apprends à utiliser l'ordinateur, l'IA, et crée ton propre outil d'aide aux devoirs.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { emoji: '💻', label: 'Ordinateur' },
            { emoji: '🤖', label: 'Intelligence IA' },
            { emoji: '🧩', label: 'Logique' },
            { emoji: '⭐', label: 'XP & Badges' },
          ].map(f => (
            <div key={f.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
              <div className="text-3xl mb-2">{f.emoji}</div>
              <p className="text-sm font-bold text-lumi-text">{f.label}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
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
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap gap-3 justify-center text-sm">
          {['🔒 Sécurisé', '👨‍🏫 Suivi professeur', '👨‍👩‍👧 Espace parent'].map(tag => (
            <span key={tag} className="px-3 py-1.5 bg-white rounded-xl font-semibold text-lumi-muted border border-gray-100 shadow-sm">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </main>
  )
}
