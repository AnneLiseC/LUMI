'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { StudentLayout } from '@/components/layout/StudentLayout'
import { RoleGuard } from '@/components/layout/RoleGuard'
import { ActivityRenderer } from '@/components/activities/ActivityRenderer'
import { Button } from '@/components/ui/Button'
import { XPBar } from '@/components/ui/XPBar'
import { cn, formatDuration } from '@/lib/utils'
import type { Session, Activity, Student, StudentActivityProgress } from '@/types'
import { getLevelForXp } from '@/types'
import { Clock, ChevronLeft, CheckCircle, Trophy } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SeancePage() {
  const { id } = useParams()
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [student, setStudent] = useState<Student | null>(null)
  const [progress, setProgress] = useState<StudentActivityProgress[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showActivity, setShowActivity] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [sessionRes, stuRes] = await Promise.all([
        supabase.from('sessions').select('*, activities(*)').eq('id', id).single(),
        supabase.from('students').select('*').eq('profile_id', user.id).single(),
      ])

      const sess = sessionRes.data
      setSession(sess)
      const acts = (sess?.activities ?? []).sort((a: Activity, b: Activity) => a.order_index - b.order_index)
      setActivities(acts)
      setStudent(stuRes.data)

      if (stuRes.data) {
        const { data: prog } = await supabase
          .from('student_activity_progress')
          .select('*')
          .eq('student_id', stuRes.data.id)

        setProgress(prog ?? [])

        // Find first not-completed activity
        const firstUndone = acts.findIndex((a: Activity) =>
          !(prog ?? []).find((p: StudentActivityProgress) => p.activity_id === a.id && p.status === 'completed')
        )
        setCurrentIndex(firstUndone === -1 ? acts.length - 1 : firstUndone)

        // Update current_session_id
        await supabase.from('students').update({ current_session_id: id }).eq('id', stuRes.data.id)
      }

      setLoading(false)
    }
    load()
  }, [id])

  const isCompleted = (actId: string) =>
    progress.some(p => p.activity_id === actId && p.status === 'completed')

  const handleActivityComplete = async (score: number, timeSpent?: number) => {
    if (!student || !activities[currentIndex]) return
    const activity = activities[currentIndex]

    const existing = progress.find(p => p.activity_id === activity.id)

    if (existing) {
      await supabase.from('student_activity_progress').update({
        status: 'completed',
        score,
        attempts: existing.attempts + 1,
        time_spent_seconds: (existing.time_spent_seconds ?? 0) + (timeSpent ?? 0),
        completed_at: new Date().toISOString(),
      }).eq('id', existing.id)
    } else {
      await supabase.from('student_activity_progress').insert({
        student_id: student.id,
        activity_id: activity.id,
        status: 'completed',
        score,
        attempts: 1,
        time_spent_seconds: timeSpent ?? 0,
        completed_at: new Date().toISOString(),
      })

      // Award XP
      const newXp = student.xp + activity.xp_reward
      const newLevel = getLevelForXp(newXp).level
      await supabase.from('students').update({ xp: newXp, level: newLevel }).eq('id', student.id)
      setStudent(s => s ? { ...s, xp: newXp, level: newLevel } : s)
      toast.success(`+${activity.xp_reward} XP ! ⚡`, { icon: '⭐' })
    }

    // Reload progress
    const { data: newProg } = await supabase
      .from('student_activity_progress')
      .select('*')
      .eq('student_id', student.id)
    setProgress(newProg ?? [])
    setShowActivity(false)
  }

  const handleNext = () => {
    if (currentIndex + 1 < activities.length) {
      setCurrentIndex(i => i + 1)
      setShowActivity(false)
    } else {
      router.push('/eleve/parcours')
    }
  }

  if (loading || !session) {
    return (
      <RoleGuard allowedRoles={['student']}>
        <StudentLayout>
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-lumi-blue border-t-transparent rounded-full animate-spin" />
          </div>
        </StudentLayout>
      </RoleGuard>
    )
  }

  const currentActivity = activities[currentIndex]
  const completedCount = activities.filter(a => isCompleted(a.id)).length
  const allDone = completedCount === activities.length

  return (
    <RoleGuard allowedRoles={['student']}>
      <StudentLayout student={student ?? undefined}>
        <div className="space-y-6 max-w-2xl mx-auto">
          {/* Back + header */}
          <div>
            <button
              onClick={() => router.push('/eleve/parcours')}
              className="flex items-center gap-1 text-lumi-muted hover:text-lumi-blue transition-colors mb-4 font-semibold text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              Retour au parcours
            </button>

            <div className="bg-gradient-to-r from-lumi-blue-light to-lumi-purple-light rounded-3xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  {session.is_assessment && (
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-lumi-purple text-white mb-2 inline-block">
                      📋 Bilan
                    </span>
                  )}
                  {session.is_final_project && (
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-orange-500 text-white mb-2 inline-block">
                      🏆 Projet final
                    </span>
                  )}
                  <h1 className="text-2xl font-black text-lumi-text">{session.title}</h1>
                  <p className="text-lumi-muted text-sm mt-1">{session.objective}</p>
                </div>
                <div className="flex items-center gap-1 text-sm text-lumi-muted flex-shrink-0">
                  <Clock className="w-4 h-4" />
                  <span>{formatDuration(session.estimated_duration_minutes)}</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-lumi-muted mb-1">
                  <span>{completedCount} / {activities.length} activités</span>
                  <span>{Math.round((completedCount / activities.length) * 100)}%</span>
                </div>
                <div className="h-3 bg-white/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-lumi-green rounded-full transition-all duration-500"
                    style={{ width: `${(completedCount / activities.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* All done! */}
          {allDone && (
            <div className="bg-lumi-green-light border-2 border-lumi-green rounded-3xl p-6 text-center">
              <Trophy className="w-12 h-12 text-lumi-green mx-auto mb-3" />
              <h2 className="text-2xl font-black text-green-800">Séance terminée !</h2>
              <p className="text-green-700 mt-2">Tu as complété toutes les activités. Bravo !</p>
              <Button onClick={() => router.push('/eleve/parcours')} className="mt-4" size="lg">
                Retour au parcours →
              </Button>
            </div>
          )}

          {/* Activity list */}
          {!showActivity && (
            <div className="space-y-3">
              <h2 className="text-lg font-black text-lumi-text">Activités de la séance</h2>
              {activities.map((act, i) => {
                const done = isCompleted(act.id)
                const isCurrent = i === currentIndex
                return (
                  <button
                    key={act.id}
                    onClick={() => { setCurrentIndex(i); setShowActivity(true) }}
                    className={cn(
                      'w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center gap-4',
                      done
                        ? 'bg-lumi-green-light border-lumi-green'
                        : isCurrent
                        ? 'bg-lumi-blue-light border-lumi-blue'
                        : 'bg-white border-gray-200 hover:border-lumi-blue'
                    )}
                  >
                    <div className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-black',
                      done ? 'bg-lumi-green text-white' : isCurrent ? 'bg-lumi-blue text-white' : 'bg-gray-100 text-lumi-muted'
                    )}>
                      {done ? <CheckCircle className="w-6 h-6" /> : i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-lumi-text text-sm">{act.title}</div>
                      <div className="text-xs text-lumi-muted mt-0.5 flex items-center gap-2">
                        <span>{act.duration_minutes} min</span>
                        <span>·</span>
                        <span>+{act.xp_reward} XP</span>
                      </div>
                    </div>
                    <span className="text-lumi-muted text-sm">
                      {done ? '✓' : isCurrent ? '▶' : ''}
                    </span>
                  </button>
                )
              })}
            </div>
          )}

          {/* Active activity */}
          {showActivity && currentActivity && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowActivity(false)}
                  className="flex items-center gap-1 text-lumi-muted hover:text-lumi-blue text-sm font-semibold"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Liste des activités
                </button>
                <span className="text-xs text-lumi-muted">
                  {currentIndex + 1} / {activities.length}
                </span>
              </div>

              <div className="bg-white rounded-3xl border-2 border-lumi-blue-light p-6 shadow-sm">
                <div className="mb-6">
                  <h3 className="text-xl font-black text-lumi-text">{currentActivity.title}</h3>
                  {currentActivity.instructions && (
                    <p className="text-lumi-muted text-sm mt-2 bg-lumi-blue-light rounded-2xl p-3">
                      💡 {currentActivity.instructions}
                    </p>
                  )}
                </div>
                <ActivityRenderer
                  activity={currentActivity}
                  onComplete={handleActivityComplete}
                />
              </div>

              {isCompleted(currentActivity.id) && (
                <Button onClick={handleNext} className="w-full" size="lg">
                  {currentIndex + 1 < activities.length ? 'Activité suivante →' : '🎉 Terminer la séance'}
                </Button>
              )}
            </div>
          )}

          {!showActivity && !allDone && currentActivity && (
            <Button
              onClick={() => setShowActivity(true)}
              className="w-full"
              size="lg"
            >
              {isCompleted(currentActivity.id) ? `Reprendre l'activité ${currentIndex + 1}` : `▶ Commencer l'activité ${currentIndex + 1}`}
            </Button>
          )}
        </div>
      </StudentLayout>
    </RoleGuard>
  )
}
