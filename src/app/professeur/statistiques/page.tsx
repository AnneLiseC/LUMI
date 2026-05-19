'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AppLayout } from '@/components/layout/AppLayout'
import { RoleGuard } from '@/components/layout/RoleGuard'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import type { Student, Profile, Session, Activity, StudentActivityProgress } from '@/types'
import { getLevelForXp } from '@/types'

interface StudentWithProfile extends Student {
  profile: Profile
}

interface ActivityStat {
  id: string
  title: string
  type: string
  xp_reward: number
  sessionTitle: string
  completions: number
  totalStudents: number
  avgScore: number | null
  avgTime: number | null
}

export default function StatistiquesPage() {
  const [students, setStudents] = useState<StudentWithProfile[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [allProgress, setAllProgress] = useState<(StudentActivityProgress & { student_id: string })[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: links } = await supabase
        .from('teacher_students')
        .select('student_id')
        .eq('teacher_id', user.id)

      const ids = (links ?? []).map(l => l.student_id)
      if (ids.length === 0) { setLoading(false); return }

      const [stuRes, sessRes] = await Promise.all([
        supabase.from('students').select('*, profile:profiles(*)').in('id', ids),
        supabase.from('sessions').select('*, activities(*)').order('order_index'),
      ])

      setStudents(stuRes.data ?? [])
      setSessions(sessRes.data ?? [])

      const { data: prog } = await supabase
        .from('student_activity_progress')
        .select('*')
        .in('student_id', ids)
        .eq('status', 'completed')

      setAllProgress(prog ?? [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <RoleGuard allowedRoles={['teacher']}>
        <AppLayout role="teacher">
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-lumi-purple border-t-transparent rounded-full animate-spin" />
          </div>
        </AppLayout>
      </RoleGuard>
    )
  }

  const totalStudents = students.length
  if (totalStudents === 0) {
    return (
      <RoleGuard allowedRoles={['teacher']}>
        <AppLayout role="teacher">
          <div className="text-center py-20 text-lumi-muted">Aucun élève lié à votre compte.</div>
        </AppLayout>
      </RoleGuard>
    )
  }

  // Global stats
  const totalCompleted = allProgress.length
  const avgXp = Math.round(students.reduce((s, st) => s + st.xp, 0) / totalStudents)
  const activeStudents = students.filter(s =>
    allProgress.some(p => p.student_id === s.id)
  ).length

  // Per-session stats
  const sessionStats = sessions.map(session => {
    const acts = (session.activities ?? []) as Activity[]
    const totalActs = acts.length
    if (totalActs === 0) return null
    const completedStudents = students.filter(s =>
      acts.every(a => allProgress.some(p => p.student_id === s.id && p.activity_id === a.id))
    ).length
    const partialStudents = students.filter(s =>
      acts.some(a => allProgress.some(p => p.student_id === s.id && p.activity_id === a.id)) &&
      !acts.every(a => allProgress.some(p => p.student_id === s.id && p.activity_id === a.id))
    ).length
    const completionPct = Math.round((completedStudents / totalStudents) * 100)
    return { session, completedStudents, partialStudents, completionPct, totalActs }
  }).filter(Boolean)

  // Per-activity stats (sorted by lowest completion rate)
  const activityStats: ActivityStat[] = sessions.flatMap(session =>
    ((session.activities ?? []) as Activity[]).map(act => {
      const progForAct = allProgress.filter(p => p.activity_id === act.id)
      const completions = progForAct.length
      const scores = progForAct.map(p => p.score).filter((s): s is number => s !== null)
      const times = progForAct.map(p => p.time_spent_seconds).filter((t): t is number => t > 0)
      return {
        id: act.id,
        title: act.title,
        type: act.type,
        xp_reward: act.xp_reward,
        sessionTitle: session.title,
        completions,
        totalStudents,
        avgScore: scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null,
        avgTime: times.length > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : null,
      }
    })
  )

  const difficultActivities = activityStats
    .filter(a => a.completions > 0 && a.avgScore !== null && a.avgScore < 70)
    .sort((a, b) => (a.avgScore ?? 100) - (b.avgScore ?? 100))
    .slice(0, 5)

  const notStartedActivities = activityStats
    .filter(a => a.completions === 0)

  // Per-student summary
  const studentSummaries = students.map(s => {
    const prog = allProgress.filter(p => p.student_id === s.id)
    const totalTime = prog.reduce((sum, p) => sum + (p.time_spent_seconds ?? 0), 0)
    const level = getLevelForXp(s.xp)
    const completedSessions = sessions.filter(sess =>
      ((sess.activities ?? []) as Activity[]).length > 0 &&
      ((sess.activities ?? []) as Activity[]).every(a =>
        prog.some(p => p.activity_id === a.id)
      )
    ).length
    return { student: s, completed: prog.length, totalTime, level, completedSessions }
  }).sort((a, b) => b.student.xp - a.student.xp)

  const formatTime = (s: number) => {
    if (s < 60) return `${s}s`
    if (s < 3600) return `${Math.floor(s / 60)}min`
    return `${Math.floor(s / 3600)}h${Math.floor((s % 3600) / 60)}min`
  }

  const typeEmoji: Record<string, string> = {
    quiz: '❓', typing: '⌨️', reflection: '✍️', editor: '✍️',
    drag_and_drop: '🖱️', order: '🔢', emotion: '💛', card: '🃏',
    intro: '📖', flashcard: '🃏', comparison: '⚖️', guided_search: '🔍',
    project_step: '🏗️', map: '🗺️', todo: '✅', search: '🔎',
  }

  return (
    <RoleGuard allowedRoles={['teacher']}>
      <AppLayout role="teacher">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-lumi-text">Statistiques de classe 📊</h1>
            <p className="text-lumi-muted mt-1">{totalStudents} élève{totalStudents > 1 ? 's' : ''} suivis</p>
          </div>

          {/* Global KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Élèves actifs', value: `${activeStudents}/${totalStudents}`, color: 'text-lumi-green', emoji: '🟢' },
              { label: 'Activités complétées', value: totalCompleted, color: 'text-lumi-blue', emoji: '✅' },
              { label: 'XP moyen', value: `${avgXp} XP`, color: 'text-lumi-purple', emoji: '⚡' },
              { label: 'Séances finies (total)', value: sessionStats.filter(s => s && s.completedStudents > 0).length, color: 'text-lumi-yellow', emoji: '📚' },
            ].map(stat => (
              <Card key={stat.label} padding="sm">
                <div className="text-center py-1">
                  <div className="text-lg mb-1">{stat.emoji}</div>
                  <div className={cn('text-xl font-black', stat.color)}>{stat.value}</div>
                  <div className="text-xs text-lumi-muted mt-0.5 leading-tight">{stat.label}</div>
                </div>
              </Card>
            ))}
          </div>

          {/* Student leaderboard */}
          <Card>
            <h2 className="text-lg font-black text-lumi-text mb-4">🏆 Classement des élèves</h2>
            <div className="space-y-2">
              {studentSummaries.map(({ student, completed, totalTime, level, completedSessions }, i) => (
                <div key={student.id} className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 hover:bg-lumi-blue-light transition-colors">
                  <div className={cn(
                    'w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0',
                    i === 0 ? 'bg-yellow-400 text-white' : i === 1 ? 'bg-gray-300 text-white' : i === 2 ? 'bg-amber-600 text-white' : 'bg-gray-100 text-lumi-muted'
                  )}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-lumi-text">
                      {student.profile?.first_name} {student.profile?.last_name}
                    </div>
                    <div className="text-xs text-lumi-muted">
                      Niv.{level.level} · {completed} activités · {completedSessions} séance{completedSessions > 1 ? 's' : ''}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-black text-lumi-purple text-sm">{student.xp} XP</div>
                    {totalTime > 0 && <div className="text-xs text-lumi-muted">{formatTime(totalTime)}</div>}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Session completion overview */}
          <Card>
            <h2 className="text-lg font-black text-lumi-text mb-4">📚 Avancement par séance</h2>
            <div className="space-y-3">
              {sessionStats.map(stat => {
                if (!stat) return null
                const { session, completedStudents, partialStudents, completionPct } = stat
                return (
                  <div key={session.id}>
                    <div className="flex justify-between items-center text-sm mb-1">
                      <span className="font-semibold text-lumi-text truncate pr-2">{session.title}</span>
                      <span className="text-lumi-muted flex-shrink-0 text-xs">{completedStudents}/{totalStudents} terminé</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-lumi-green transition-all"
                        style={{ width: `${completionPct}%` }}
                      />
                      <div
                        className="h-full bg-lumi-yellow transition-all"
                        style={{ width: `${Math.round((partialStudents / totalStudents) * 100)}%` }}
                      />
                    </div>
                    <div className="flex gap-3 text-xs text-lumi-muted mt-0.5">
                      {completedStudents > 0 && <span className="text-lumi-green font-semibold">{completedStudents} terminés</span>}
                      {partialStudents > 0 && <span className="text-lumi-yellow font-semibold">{partialStudents} en cours</span>}
                      {totalStudents - completedStudents - partialStudents > 0 && (
                        <span>{totalStudents - completedStudents - partialStudents} pas commencé</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="flex gap-4 mt-4 text-xs">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-lumi-green inline-block" /> Terminé</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-lumi-yellow inline-block" /> En cours</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-gray-200 inline-block" /> Pas commencé</span>
            </div>
          </Card>

          {/* Difficult activities */}
          {difficultActivities.length > 0 && (
            <Card>
              <h2 className="text-lg font-black text-lumi-text mb-1">⚠️ Activités difficiles</h2>
              <p className="text-xs text-lumi-muted mb-4">Score moyen inférieur à 70% — à retravailler en classe</p>
              <div className="space-y-2">
                {difficultActivities.map(act => (
                  <div key={act.id} className="flex items-center gap-3 p-3 rounded-2xl bg-red-50 border border-red-100">
                    <span className="text-2xl">{typeEmoji[act.type] ?? '📝'}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-lumi-text">{act.title}</div>
                      <div className="text-xs text-lumi-muted">{act.sessionTitle}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-black text-red-500 text-sm">{act.avgScore}%</div>
                      <div className="text-xs text-lumi-muted">{act.completions} élève{act.completions > 1 ? 's' : ''}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Not started activities */}
          {notStartedActivities.length > 0 && (
            <Card>
              <h2 className="text-lg font-black text-lumi-text mb-1">💤 Activités pas encore commencées</h2>
              <p className="text-xs text-lumi-muted mb-3">Aucun élève n'a encore fait ces activités</p>
              <div className="flex flex-wrap gap-2">
                {notStartedActivities.slice(0, 10).map(act => (
                  <span key={act.id} className="px-3 py-1.5 bg-gray-100 rounded-xl text-xs font-semibold text-lumi-muted">
                    {typeEmoji[act.type] ?? '📝'} {act.title}
                  </span>
                ))}
                {notStartedActivities.length > 10 && (
                  <span className="px-3 py-1.5 bg-gray-100 rounded-xl text-xs font-semibold text-lumi-muted">
                    +{notStartedActivities.length - 10} autres
                  </span>
                )}
              </div>
            </Card>
          )}
        </div>
      </AppLayout>
    </RoleGuard>
  )
}
