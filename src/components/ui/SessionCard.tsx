'use client'

import Link from 'next/link'
import { cn, formatDuration } from '@/lib/utils'
import type { Session } from '@/types'
import { Clock, CheckCircle, Lock, Star, Trophy } from 'lucide-react'

interface SessionCardProps {
  session: Session
  completed: number
  total: number
  isUnlocked: boolean
  isActive?: boolean
}

export function SessionCard({ session, completed, total, isUnlocked, isActive }: SessionCardProps) {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0
  const isDone = percent === 100

  const blockColors: Record<string, string> = {
    'Bloc 0 – Découverte': 'border-lumi-blue bg-lumi-blue-light',
    'Bloc 1 – Ordinateur & Productivité': 'border-lumi-green bg-lumi-green-light',
    'Bloc 2 – IA & Esprit critique': 'border-lumi-purple bg-lumi-purple-light',
    'Bloc 3 – Logique & Autonomie': 'border-lumi-yellow bg-lumi-yellow-light',
    'Projet final': 'border-orange-400 bg-orange-50',
  }

  const colorClass = blockColors[session.block_name] ?? 'border-lumi-blue bg-lumi-blue-light'

  const icon = session.is_final_project ? '🏆' : session.is_assessment ? '📋' : `${session.session_number}`

  return (
    <div
      className={cn(
        'rounded-3xl border-2 p-5 transition-all duration-300',
        colorClass,
        isUnlocked
          ? 'cursor-pointer hover:shadow-lg hover:-translate-y-1'
          : 'opacity-60 cursor-not-allowed grayscale',
        isActive && 'ring-4 ring-lumi-blue ring-offset-2',
        isDone && 'ring-4 ring-lumi-green ring-offset-2'
      )}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-white/80 flex items-center justify-center text-xl font-black flex-shrink-0 shadow-sm">
          {isDone ? <CheckCircle className="text-lumi-green w-7 h-7" /> : !isUnlocked ? <Lock className="text-gray-400 w-6 h-6" /> : icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {session.is_assessment && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/70 text-lumi-purple">
                📋 Bilan
              </span>
            )}
            {session.is_final_project && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/70 text-orange-600">
                🏆 Projet
              </span>
            )}
            {isActive && !isDone && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-lumi-blue text-white animate-pulse">
                En cours
              </span>
            )}
          </div>

          <h3 className="font-bold text-lumi-text text-base mt-1 leading-tight">{session.title}</h3>
          <p className="text-sm text-lumi-muted mt-1 line-clamp-2">{session.objective}</p>

          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-1 text-xs text-lumi-muted">
              <Clock className="w-3 h-3" />
              <span>{formatDuration(session.estimated_duration_minutes)}</span>
            </div>
            {isUnlocked && total > 0 && (
              <div className="flex items-center gap-1 text-xs text-lumi-muted">
                <Star className="w-3 h-3" />
                <span>{completed}/{total} activités</span>
              </div>
            )}
          </div>

          {isUnlocked && total > 0 && (
            <div className="mt-3">
              <div className="h-2 bg-white/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-lumi-green rounded-full transition-all duration-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {isUnlocked && (
        <Link
          href={`/eleve/seance/${session.id}`}
          className={cn(
            'mt-4 w-full py-2.5 rounded-2xl text-sm font-bold text-center block transition-all',
            isDone
              ? 'bg-lumi-green text-white hover:bg-green-500'
              : 'bg-white text-lumi-blue hover:bg-lumi-blue hover:text-white'
          )}
        >
          {isDone ? '✓ Revoir la séance' : percent > 0 ? '▶ Continuer' : '▶ Commencer'}
        </Link>
      )}
    </div>
  )
}
