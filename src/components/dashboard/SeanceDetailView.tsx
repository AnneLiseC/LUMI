'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/Card'
import { cn, formatDuration } from '@/lib/utils'
import type { Session, Activity } from '@/types'
import { ChevronLeft, Clock, Zap, BookOpen } from 'lucide-react'

const ACTIVITY_TYPE_LABELS: Record<string, string> = {
  intro: '👋 Introduction',
  quiz: '❓ Quiz',
  typing: '⌨️ Clavier',
  drag_and_drop: '🖱️ Glisser-déposer',
  order: '🔢 Remettre en ordre',
  flashcard: '🃏 Flashcards',
  reflection: '✍️ Réflexion écrite',
  editor: '📝 Éditeur texte',
  todo: '✅ Liste de tâches',
  comparison: '⚖️ Comparaison',
  search: '🔍 Recherche guidée',
  emotion: '💛 Auto-évaluation',
  card: '📋 Cartes informatives',
  map: '🗺️ Carte mentale',
  project_step: '🏗️ Étape projet',
}

function ContentSummary({ type, content }: { type: string; content: Record<string, unknown> }) {
  if (type === 'quiz') {
    const questions = (content.questions ?? []) as { text: string; options: string[]; correct: number }[]
    return (
      <div className="space-y-3">
        {questions.map((q, i) => (
          <div key={i} className="bg-gray-50 rounded-xl p-3 text-sm">
            <p className="font-semibold text-lumi-text mb-1">{i + 1}. {q.text}</p>
            <div className="space-y-1">
              {q.options.map((opt, j) => (
                <div key={j} className={cn('flex items-center gap-2 px-2 py-1 rounded-lg', j === q.correct ? 'bg-green-100 text-green-800 font-semibold' : 'text-lumi-muted')}>
                  <span>{j === q.correct ? '✓' : '○'}</span>
                  <span>{opt}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (type === 'typing') {
    return (
      <div className="bg-lumi-blue-light rounded-xl p-3">
        <p className="text-xs font-bold text-lumi-muted mb-1">Texte à taper :</p>
        <p className="font-mono text-sm text-lumi-text">"{content.text as string}"</p>
      </div>
    )
  }

  if (type === 'order') {
    const steps = (content.steps ?? []) as string[]
    return (
      <div className="space-y-1.5">
        <p className="text-xs font-bold text-lumi-muted">Ordre correct :</p>
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span className="w-5 h-5 rounded-lg bg-lumi-blue text-white flex items-center justify-center text-xs font-black flex-shrink-0">{i + 1}</span>
            <span className="text-lumi-text">{step}</span>
          </div>
        ))}
      </div>
    )
  }

  if (type === 'drag_and_drop') {
    const folders = (content.folders ?? []) as string[]
    const files = (content.files ?? content.items ?? []) as { name?: string; label?: string; correct_folder?: string; target?: string }[]
    return (
      <div className="space-y-2">
        {folders.length > 0 && (
          <div>
            <p className="text-xs font-bold text-lumi-muted mb-1">Dossiers :</p>
            <div className="flex flex-wrap gap-1">
              {folders.map(f => <span key={f} className="px-2 py-1 bg-lumi-green-light text-green-800 rounded-lg text-xs font-semibold">📁 {f}</span>)}
            </div>
          </div>
        )}
        {files.length > 0 && (
          <div>
            <p className="text-xs font-bold text-lumi-muted mb-1">Fichiers à placer :</p>
            <div className="space-y-1">
              {files.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className="text-lumi-text font-semibold">{f.name ?? f.label}</span>
                  <span className="text-lumi-muted">→</span>
                  <span className="text-lumi-green font-bold">{f.correct_folder ?? f.target}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  if (type === 'card') {
    const cards = (content.cards ?? []) as { title: string; emoji?: string; description?: string }[]
    const analogy = content.analogy as { title?: string; text?: string } | undefined
    return (
      <div className="space-y-2">
        {analogy && (
          <div className="bg-lumi-yellow-light rounded-xl p-3 text-sm">
            <p className="font-bold">{analogy.title ?? 'Analogie'}</p>
            {analogy.text && <p className="text-lumi-muted mt-0.5">{analogy.text}</p>}
          </div>
        )}
        <div className="grid grid-cols-2 gap-2">
          {cards.map((c, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-xl p-2 text-xs">
              <span className="font-bold">{c.emoji} {c.title}</span>
              {c.description && <p className="text-lumi-muted mt-0.5">{c.description}</p>}
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (type === 'comparison') {
    const responses = (content.responses ?? []) as { id: string; label: string; text?: string }[]
    const best = content.best as string | undefined
    return (
      <div className="space-y-2">
        {(content.prompt as string | undefined) && (
          <div className="bg-lumi-blue-light rounded-xl p-2 text-sm">
            <span className="font-bold">Prompt : </span>"{content.prompt as string}"
          </div>
        )}
        {responses.map(r => (
          <div key={r.id} className={cn('rounded-xl p-2 text-xs border-2', r.id === best ? 'border-lumi-green bg-green-50' : 'border-gray-100 bg-gray-50')}>
            <span className="font-bold">{r.label} {r.id === best ? '✓ Meilleure réponse' : ''}</span>
            {r.text && <p className="text-lumi-muted mt-0.5 line-clamp-2">{r.text}</p>}
          </div>
        ))}
      </div>
    )
  }

  if (type === 'emotion') {
    const questions = (content.questions ?? []) as { text: string; emoji: string }[]
    const scale = content.scale as Record<string, string> | undefined
    return (
      <div className="space-y-1.5">
        {scale && (
          <div className="flex gap-2 text-xs text-lumi-muted mb-2">
            {Object.entries(scale).map(([k, v]) => <span key={k}>{k}={v}</span>)}
          </div>
        )}
        {questions.map((q, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span>{q.emoji}</span>
            <span className="text-lumi-text">{q.text}</span>
          </div>
        ))}
      </div>
    )
  }

  if (type === 'project_step') {
    const step = content.step as number
    const needs = content.needs as string[] | undefined
    const features = content.features as { label: string; emoji: string; description?: string }[] | undefined
    const questions = content.questions as { label: string }[] | undefined
    return (
      <div className="space-y-2">
        <p className="text-xs font-bold text-lumi-muted">Étape {step} / 4</p>
        {needs && needs.map((n, i) => <div key={i} className="text-sm flex items-center gap-2"><span className="text-lumi-blue">•</span>{n}</div>)}
        {features && features.map((f, i) => (
          <div key={i} className="text-sm flex items-center gap-2">
            <span>{f.emoji}</span>
            <span className="font-semibold">{f.label}</span>
            {f.description && <span className="text-lumi-muted text-xs">— {f.description}</span>}
          </div>
        ))}
        {questions && questions.map((q, i) => <div key={i} className="text-sm"><span className="font-semibold">{i + 1}.</span> {q.label}</div>)}
      </div>
    )
  }

  if (['reflection', 'editor', 'search', 'todo'].includes(type)) {
    const prompts = (content.prompts ?? content.tasks ?? []) as (string | { label: string })[]
    return (
      <div className="space-y-1.5">
        {prompts.map((p, i) => (
          <div key={i} className="flex items-start gap-2 text-sm">
            <span className="text-lumi-purple font-black flex-shrink-0">{i + 1}.</span>
            <span className="text-lumi-text">{typeof p === 'string' ? p : p.label}</span>
          </div>
        ))}
      </div>
    )
  }

  return <p className="text-xs text-lumi-muted italic">Contenu disponible dans l'application élève.</p>
}

interface SeanceDetailViewProps {
  sessionId: string
  backPath: string
}

export function SeanceDetailView({ sessionId, backPath }: SeanceDetailViewProps) {
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('sessions')
        .select('*, activities(*)')
        .eq('id', sessionId)
        .single()
      if (data) {
        data.activities = (data.activities ?? []).sort((a: Activity, b: Activity) => a.order_index - b.order_index)
      }
      setSession(data)
      setLoading(false)
    }
    load()
  }, [sessionId])

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-lumi-purple border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) {
    return <p className="text-lumi-muted text-center py-20">Séance introuvable.</p>
  }

  const activities = (session.activities ?? []) as Activity[]
  const totalXp = activities.reduce((sum, a) => sum + a.xp_reward, 0)

  return (
    <div className="space-y-6 max-w-3xl">
      <button
        onClick={() => router.push(backPath)}
        className="flex items-center gap-1 text-lumi-muted hover:text-lumi-purple font-semibold text-sm"
      >
        <ChevronLeft className="w-4 h-4" />
        Retour au programme
      </button>

      <div className="bg-gradient-to-r from-lumi-purple-light to-lumi-blue-light rounded-3xl p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex gap-2 mb-2">
              {session.is_assessment && (
                <span className="text-xs px-2 py-1 rounded-full bg-lumi-purple text-white font-bold">📋 Bilan</span>
              )}
              {session.is_final_project && (
                <span className="text-xs px-2 py-1 rounded-full bg-orange-500 text-white font-bold">🏆 Projet final</span>
              )}
              <span className="text-xs px-2 py-1 rounded-full bg-white/70 text-lumi-muted font-semibold">
                {session.block_name}
              </span>
            </div>
            <h1 className="text-2xl font-black text-lumi-text">{session.title}</h1>
            <p className="text-lumi-muted mt-1">{session.description}</p>
          </div>
          <div className="flex gap-4 text-sm">
            <div className="text-center bg-white/70 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-1 font-black text-lumi-blue">
                <Clock className="w-4 h-4" />
                {formatDuration(session.estimated_duration_minutes)}
              </div>
              <div className="text-xs text-lumi-muted mt-0.5">Durée</div>
            </div>
            <div className="text-center bg-white/70 rounded-2xl px-4 py-3">
              <div className="font-black text-lumi-purple">{activities.length}</div>
              <div className="text-xs text-lumi-muted mt-0.5">Activités</div>
            </div>
            <div className="text-center bg-white/70 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-1 font-black text-yellow-600">
                <Zap className="w-4 h-4" />
                {totalXp}
              </div>
              <div className="text-xs text-lumi-muted mt-0.5">XP total</div>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-white/70 rounded-2xl p-4">
          <p className="text-xs font-black text-lumi-muted uppercase tracking-wide mb-1">🎯 Objectif pédagogique</p>
          <p className="font-semibold text-lumi-text">{session.objective}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-black text-lumi-text flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-lumi-purple" />
          Détail des activités
        </h2>

        {activities.map((act, i) => (
          <Card key={act.id} className="border-l-4 border-lumi-purple">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-lumi-purple text-white flex items-center justify-center font-black text-sm flex-shrink-0">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <h3 className="font-black text-lumi-text text-base">{act.title}</h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-lumi-purple-light text-lumi-purple font-bold">
                        {ACTIVITY_TYPE_LABELS[act.type] ?? act.type}
                      </span>
                      <span className="text-xs text-lumi-muted flex items-center gap-1">
                        <Clock className="w-3 h-3" />{act.duration_minutes} min
                      </span>
                      <span className="text-xs text-yellow-600 font-bold">+{act.xp_reward} XP</span>
                    </div>
                  </div>
                </div>

                {act.instructions && (
                  <div className="mt-3 bg-lumi-blue-light rounded-xl p-3">
                    <p className="text-xs font-bold text-lumi-muted mb-0.5">💡 Consigne pour l'élève</p>
                    <p className="text-sm text-lumi-text">{act.instructions}</p>
                  </div>
                )}

                <div className="mt-3">
                  <p className="text-xs font-bold text-lumi-muted uppercase tracking-wide mb-2">Contenu de l'activité</p>
                  <ContentSummary type={act.type} content={act.content as Record<string, unknown>} />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
