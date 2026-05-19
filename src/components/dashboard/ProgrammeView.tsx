'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { cn, formatDuration } from '@/lib/utils'
import type { Session, Activity } from '@/types'
import { Clock, ChevronDown, ChevronRight } from 'lucide-react'

const ACTIVITY_TYPE_LABELS: Record<string, string> = {
  intro: '👋 Introduction',
  quiz: '❓ Quiz',
  typing: '⌨️ Clavier',
  drag_and_drop: '🖱️ Glisser-déposer',
  order: '🔢 Remettre en ordre',
  flashcard: '🃏 Flashcards',
  reflection: '✍️ Réflexion',
  editor: '📝 Éditeur',
  todo: '✅ Liste de tâches',
  comparison: '⚖️ Comparaison',
  search: '🔍 Recherche',
  emotion: '💛 Ressenti',
  card: '📋 Cartes',
  map: '🗺️ Carte mentale',
  project_step: '🏗️ Étape projet',
}

const BLOCK_COLORS: Record<string, { bg: string; border: string; badge: string }> = {
  'Bloc 0 – Découverte':                { bg: 'bg-blue-50',   border: 'border-lumi-blue',   badge: 'bg-lumi-blue text-white' },
  'Bloc 1 – Ordinateur & Productivité': { bg: 'bg-green-50',  border: 'border-lumi-green',  badge: 'bg-lumi-green text-white' },
  'Bloc 2 – IA & Esprit critique':      { bg: 'bg-purple-50', border: 'border-lumi-purple', badge: 'bg-lumi-purple text-white' },
  'Bloc 3 – Logique & Autonomie':       { bg: 'bg-yellow-50', border: 'border-yellow-400',  badge: 'bg-yellow-400 text-white' },
  'Projet final':                       { bg: 'bg-orange-50', border: 'border-orange-400',  badge: 'bg-orange-400 text-white' },
}

interface ProgrammeViewProps {
  detailBasePath: string  // '/professeur/seance' or '/parent/seance'
}

export function ProgrammeView({ detailBasePath }: ProgrammeViewProps) {
  const [sessions, setSessions] = useState<Session[]>([])
  const [openSessions, setOpenSessions] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('sessions')
        .select('*, activities(*)')
        .order('order_index')
      setSessions(
        (data ?? []).map(s => ({
          ...s,
          activities: (s.activities ?? []).sort((a: Activity, b: Activity) => a.order_index - b.order_index),
        }))
      )
      setLoading(false)
    }
    load()
  }, [])

  const toggle = (id: string) =>
    setOpenSessions(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const grouped: Record<string, Session[]> = {}
  sessions.forEach(s => {
    if (!grouped[s.block_name]) grouped[s.block_name] = []
    grouped[s.block_name].push(s)
  })

  const totalActivities = sessions.reduce((sum, s) => sum + (s.activities?.length ?? 0), 0)
  const totalMinutes = sessions.reduce((sum, s) => sum + s.estimated_duration_minutes, 0)

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-lumi-purple border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-lumi-text">Programme complet 📚</h1>
          <p className="text-lumi-muted mt-1">
            {sessions.length} séances · {totalActivities} activités · {formatDuration(totalMinutes)} au total
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setOpenSessions(new Set(sessions.map(s => s.id)))}
            className="text-sm font-semibold px-3 py-2 rounded-xl border-2 border-lumi-purple text-lumi-purple hover:bg-lumi-purple-light transition-colors"
          >
            Tout déplier
          </button>
          <button
            onClick={() => setOpenSessions(new Set())}
            className="text-sm font-semibold px-3 py-2 rounded-xl border-2 border-gray-200 text-lumi-muted hover:bg-gray-50 transition-colors"
          >
            Tout replier
          </button>
        </div>
      </div>

      {/* Blocks */}
      {Object.entries(grouped).map(([blockName, blockSessions]) => {
        const colors = BLOCK_COLORS[blockName] ?? { bg: 'bg-gray-50', border: 'border-gray-300', badge: 'bg-gray-400 text-white' }
        const blockMinutes = blockSessions.reduce((sum, s) => sum + s.estimated_duration_minutes, 0)

        return (
          <div key={blockName} className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <span className={cn('px-3 py-1.5 rounded-xl text-xs sm:text-sm font-black', colors.badge)}>
                {blockName}
              </span>
              <span className="text-xs sm:text-sm text-lumi-muted">
                {blockSessions.length} séances · {formatDuration(blockMinutes)}
              </span>
              <div className="h-px flex-1 bg-gray-200 hidden sm:block" />
            </div>

            <div className="space-y-2">
              {blockSessions.map(session => {
                const isOpen = openSessions.has(session.id)
                const activities = (session.activities ?? []) as Activity[]

                return (
                  <div
                    key={session.id}
                    className={cn('rounded-2xl border-2 overflow-hidden transition-all', colors.border, colors.bg)}
                  >
                    <button
                      onClick={() => toggle(session.id)}
                      className="w-full text-left p-4 flex items-center gap-4 hover:bg-black/5 transition-colors"
                    >
                      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0', colors.badge)}>
                        {session.is_final_project ? '🏆' : session.is_assessment ? '📋' : session.session_number}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-black text-lumi-text text-base">{session.title}</h3>
                          {session.is_assessment && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-lumi-purple text-white font-bold">Bilan</span>
                          )}
                          {session.is_final_project && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500 text-white font-bold">Projet final</span>
                          )}
                        </div>
                        <p className="text-sm text-lumi-muted mt-0.5 line-clamp-1">{session.objective}</p>
                      </div>

                      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 text-sm text-lumi-muted">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDuration(session.estimated_duration_minutes)}
                        </span>
                        <span className="hidden sm:inline">{activities.length} activités</span>
                        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="border-t-2 border-current border-opacity-20 bg-white/70 p-4 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="bg-white rounded-xl p-3 border border-gray-100">
                            <p className="text-xs font-black text-lumi-muted uppercase tracking-wide mb-1">🎯 Objectif</p>
                            <p className="text-sm font-semibold text-lumi-text">{session.objective}</p>
                          </div>
                          {session.description && (
                            <div className="bg-white rounded-xl p-3 border border-gray-100">
                              <p className="text-xs font-black text-lumi-muted uppercase tracking-wide mb-1">📄 Description</p>
                              <p className="text-sm text-lumi-muted">{session.description}</p>
                            </div>
                          )}
                        </div>

                        <div>
                          <p className="text-xs font-black text-lumi-muted uppercase tracking-wide mb-2">
                            Activités ({activities.length})
                          </p>
                          <div className="space-y-2">
                            {activities.map((act, i) => (
                              <div key={act.id} className="bg-white rounded-xl border border-gray-100 p-3 flex items-start gap-3">
                                <span className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-black text-lumi-muted flex-shrink-0 mt-0.5">
                                  {i + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-bold text-sm text-lumi-text">{act.title}</span>
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-lumi-muted font-semibold">
                                      {ACTIVITY_TYPE_LABELS[act.type] ?? act.type}
                                    </span>
                                  </div>
                                  {act.instructions && (
                                    <p className="text-xs text-lumi-muted mt-1">{act.instructions}</p>
                                  )}
                                </div>
                                <div className="flex-shrink-0 text-right">
                                  <div className="text-xs font-bold text-lumi-muted">{act.duration_minutes} min</div>
                                  <div className="text-xs text-lumi-purple font-bold">+{act.xp_reward} XP</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <Link
                            href={`${detailBasePath}/${session.id}`}
                            className="text-sm font-bold text-lumi-purple hover:underline flex items-center gap-1"
                          >
                            Voir le détail complet →
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
