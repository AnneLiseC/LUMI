'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AppLayout } from '@/components/layout/AppLayout'
import { RoleGuard } from '@/components/layout/RoleGuard'
import { Card } from '@/components/ui/Card'
import { XPBar } from '@/components/ui/XPBar'
import { BadgeCard } from '@/components/ui/BadgeCard'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import type { Student, Profile, Session, StudentActivityProgress, StudentBadge, TeacherNote, Assessment } from '@/types'
import { getLevelForXp } from '@/types'
import { ChevronLeft, Plus, Save, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'

export default function EleveDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [student, setStudent] = useState<Student | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [teacherProfile, setTeacherProfile] = useState<Profile | null>(null)
  const [sessions, setSessions] = useState<Session[]>([])
  const [progress, setProgress] = useState<StudentActivityProgress[]>([])
  const [badges, setBadges] = useState<StudentBadge[]>([])
  const [notes, setNotes] = useState<TeacherNote[]>([])
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(true)

  // Note form
  const [showNoteForm, setShowNoteForm] = useState(false)
  const [noteText, setNoteText] = useState('')
  const [concentration, setConcentration] = useState(3)
  const [successRate, setSuccessRate] = useState<number | undefined>()
  const [savingNote, setSavingNote] = useState(false)

  // Assessment form
  const [showAssessmentForm, setShowAssessmentForm] = useState(false)
  const [assessmentFields, setAssessmentFields] = useState({
    summary: '', strengths: '', difficulties: '', recommendations: '', next_adjustments: '',
  })
  const [savingAssessment, setSavingAssessment] = useState(false)

  // Comments on answers (progressId -> comment text)
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({})
  const [savingComment, setSavingComment] = useState<Record<string, boolean>>({})

  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [stuRes, profRes, sessRes] = await Promise.all([
        supabase.from('students').select('*, profile:profiles(*)').eq('id', id).single(),
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('sessions').select('*, activities(*)').order('order_index'),
      ])

      setStudent(stuRes.data)
      setProfile(stuRes.data?.profile ?? null)
      setTeacherProfile(profRes.data)
      setSessions(sessRes.data ?? [])

      const [progRes, badgesRes, notesRes, assessRes] = await Promise.all([
        supabase.from('student_activity_progress').select('*').eq('student_id', id),
        supabase.from('student_badges').select('*, badge:badges(*)').eq('student_id', id),
        supabase.from('teacher_notes').select('*').eq('student_id', id).eq('teacher_id', user.id).order('created_at', { ascending: false }),
        supabase.from('assessments').select('*').eq('student_id', id).order('created_at', { ascending: false }),
      ])

      const prog = progRes.data ?? []
      setProgress(prog)
      // Pre-fill comment drafts from existing teacher_comment values
      const drafts: Record<string, string> = {}
      prog.forEach((p: StudentActivityProgress & { teacher_comment?: string }) => {
        if (p.teacher_comment) drafts[p.id] = p.teacher_comment
      })
      setCommentDrafts(drafts)
      setBadges(badgesRes.data ?? [])
      setNotes(notesRes.data ?? [])
      setAssessments(assessRes.data ?? [])
      setLoading(false)
    }
    load()
  }, [id])

  const saveNote = async () => {
    if (!teacherProfile || !noteText.trim()) return
    setSavingNote(true)
    const { data } = await supabase.from('teacher_notes').insert({
      teacher_id: teacherProfile.id,
      student_id: id,
      note: noteText,
      concentration_level: concentration,
      success_rate: successRate,
    }).select().single()
    if (data) {
      setNotes(prev => [data, ...prev])
      setNoteText('')
      setConcentration(3)
      setSuccessRate(undefined)
      setShowNoteForm(false)
      toast.success('Note enregistrée !')
    }
    setSavingNote(false)
  }

  const saveAssessment = async () => {
    if (!teacherProfile) return
    const { summary, strengths, difficulties, recommendations, next_adjustments } = assessmentFields
    if (!summary.trim()) { toast.error('Le résumé est obligatoire.'); return }
    setSavingAssessment(true)
    const { data } = await supabase.from('assessments').insert({
      teacher_id: teacherProfile.id,
      student_id: id,
      summary, strengths, difficulties, recommendations, next_adjustments,
    }).select().single()
    if (data) {
      setAssessments(prev => [data, ...prev])
      setAssessmentFields({ summary: '', strengths: '', difficulties: '', recommendations: '', next_adjustments: '' })
      setShowAssessmentForm(false)
      toast.success('Bilan enregistré !')
    }
    setSavingAssessment(false)
  }

  const saveComment = async (progressId: string) => {
    const comment = (commentDrafts[progressId] ?? '').trim()
    setSavingComment(prev => ({ ...prev, [progressId]: true }))
    await supabase.from('student_activity_progress')
      .update({ teacher_comment: comment || null })
      .eq('id', progressId)
    setSavingComment(prev => ({ ...prev, [progressId]: false }))
    toast.success('Commentaire enregistré !')
  }

  if (loading || !student) {
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

  const level = getLevelForXp(student.xp)
  const completedActivities = progress.filter(p => p.status === 'completed').length
  const totalTime = progress.reduce((s, p) => s + (p.time_spent_seconds ?? 0), 0)

  const formatTime = (s: number) => {
    if (s < 60) return `${s}s`
    if (s < 3600) return `${Math.floor(s / 60)} min`
    return `${Math.floor(s / 3600)}h${Math.floor((s % 3600) / 60)}min`
  }

  const getSessionStatus = (session: Session) => {
    if (!session.activities) return { completed: 0, total: 0, percent: 0 }
    const total = session.activities.length
    const completed = session.activities.filter((a: { id: string }) =>
      progress.find(p => p.activity_id === a.id && p.status === 'completed')
    ).length
    return { completed, total, percent: total > 0 ? Math.round((completed / total) * 100) : 0 }
  }

  // Collect reflection answers with their progress IDs
  const reflectionAnswers = sessions.flatMap(session =>
    (session.activities ?? [])
      .filter((a: { id: string; type: string }) => a.type === 'reflection' || a.type === 'editor')
      .map((a: { id: string; title: string; type: string }) => {
        const prog = progress.find(p => p.activity_id === a.id && p.status === 'completed') as (StudentActivityProgress & { answer_data?: { answers?: Record<string, { prompt: string; answer: string }> }; teacher_comment?: string }) | undefined
        if (!prog?.answer_data) return null
        const answers = prog.answer_data.answers ?? {}
        return {
          progressId: prog.id,
          sessionTitle: session.title,
          activityTitle: a.title,
          answers,
          completedAt: prog.completed_at,
          existingComment: prog.teacher_comment ?? null,
        }
      })
      .filter(Boolean)
  )

  return (
    <RoleGuard allowedRoles={['teacher']}>
      <AppLayout role="teacher">
        <div className="space-y-6">
          <button onClick={() => router.back()} className="flex items-center gap-1 text-lumi-muted hover:text-lumi-purple font-semibold text-sm">
            <ChevronLeft className="w-4 h-4" />
            Retour
          </button>

          {/* Header */}
          <div className="bg-gradient-to-r from-lumi-purple-light to-lumi-blue-light rounded-3xl p-5 sm:p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-lumi-purple flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0">🧒</div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-black text-lumi-text">
                  {profile?.first_name} {profile?.last_name}
                </h1>
                <p className="text-lumi-muted text-sm">Niveau {level.level} — {level.name}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs sm:text-sm text-lumi-muted">
                  <span>✅ {completedActivities} activités</span>
                  <span>🏅 {badges.length} badges</span>
                  <span>⚡ {student.xp} XP</span>
                  {totalTime > 0 && <span>⏱ {formatTime(totalTime)}</span>}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <XPBar xp={student.xp} />
            </div>
          </div>

          {/* Session progress */}
          <Card>
            <h2 className="text-xl font-black text-lumi-text mb-4">Progression par séance</h2>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {sessions.map(session => {
                const { completed, total, percent } = getSessionStatus(session)
                return (
                  <div key={session.id} className="flex items-center gap-3">
                    <div className={cn(
                      'w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0',
                      percent === 100 ? 'bg-lumi-green text-white' : percent > 0 ? 'bg-lumi-purple text-white' : 'bg-gray-100 text-gray-400'
                    )}>
                      {percent === 100 ? '✓' : session.session_number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold text-lumi-text truncate">{session.title}</span>
                        <span className="text-lumi-muted ml-2">{completed}/{total}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-lumi-purple rounded-full" style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Reflection answers with teacher comments */}
          {reflectionAnswers.length > 0 && (
            <Card>
              <h2 className="text-xl font-black text-lumi-text mb-4">✍️ Réponses écrites</h2>
              <div className="space-y-5">
                {reflectionAnswers.map((item) => item && (
                  <div key={item.progressId} className="border-2 border-lumi-purple-light rounded-2xl overflow-hidden">
                    <div className="bg-lumi-purple-light px-4 py-2 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-sm text-lumi-purple">{item.activityTitle}</span>
                        <span className="text-xs text-lumi-muted ml-2">— {item.sessionTitle}</span>
                      </div>
                      {item.completedAt && (
                        <span className="text-xs text-lumi-muted">{new Date(item.completedAt).toLocaleDateString('fr-FR')}</span>
                      )}
                    </div>
                    <div className="p-4 space-y-3">
                      {Object.values(item.answers).map((qa, i) => (
                        <div key={i}>
                          <p className="text-xs font-bold text-lumi-muted mb-1">{qa.prompt}</p>
                          <p className="text-sm text-lumi-text bg-gray-50 rounded-xl px-3 py-2">{qa.answer}</p>
                        </div>
                      ))}

                      {/* Teacher comment */}
                      <div className="pt-2 border-t border-gray-100">
                        <label className="flex items-center gap-1.5 text-xs font-bold text-lumi-purple mb-1.5">
                          <MessageSquare className="w-3.5 h-3.5" />
                          Votre commentaire
                        </label>
                        <textarea
                          rows={2}
                          value={commentDrafts[item.progressId] ?? ''}
                          onChange={e => setCommentDrafts(prev => ({ ...prev, [item.progressId]: e.target.value }))}
                          placeholder="Excellent travail ! Tu as bien expliqué…"
                          className="w-full border-2 border-lumi-purple-light rounded-xl p-2.5 text-sm resize-none focus:outline-none focus:border-lumi-purple transition-colors"
                        />
                        <div className="flex justify-end mt-1.5">
                          <Button
                            size="sm"
                            onClick={() => saveComment(item.progressId)}
                            loading={savingComment[item.progressId]}
                          >
                            <Save className="w-3.5 h-3.5 mr-1" />
                            Enregistrer
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Assessments / Bilans */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black text-lumi-text">📋 Bilans</h2>
              <Button onClick={() => setShowAssessmentForm(!showAssessmentForm)} size="sm" variant="secondary">
                <Plus className="w-4 h-4 mr-1" />
                Nouveau bilan
              </Button>
            </div>

            {showAssessmentForm && (
              <div className="bg-lumi-blue-light rounded-2xl p-4 mb-5 space-y-3">
                <h3 className="font-black text-lumi-text text-sm">Bilan pédagogique</h3>
                {([
                  { key: 'summary', label: 'Résumé général *', placeholder: 'Vue d\'ensemble du parcours de l\'élève…' },
                  { key: 'strengths', label: 'Points forts', placeholder: 'Ce que l\'élève maîtrise bien…' },
                  { key: 'difficulties', label: 'Difficultés observées', placeholder: 'Ce qui pose encore problème…' },
                  { key: 'recommendations', label: 'Recommandations', placeholder: 'Conseils pour progresser…' },
                  { key: 'next_adjustments', label: 'Ajustements prévus', placeholder: 'Ce que je vais adapter dans les prochaines séances…' },
                ] as { key: keyof typeof assessmentFields; label: string; placeholder: string }[]).map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="text-xs font-bold text-lumi-text block mb-1">{label}</label>
                    <textarea
                      rows={2}
                      value={assessmentFields[key]}
                      onChange={e => setAssessmentFields(prev => ({ ...prev, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full border-2 border-white rounded-xl p-2.5 text-sm resize-none focus:outline-none focus:border-lumi-blue"
                    />
                  </div>
                ))}
                <div className="flex gap-2">
                  <Button onClick={saveAssessment} loading={savingAssessment} size="sm">
                    <Save className="w-4 h-4 mr-1" />
                    Enregistrer le bilan
                  </Button>
                  <Button onClick={() => setShowAssessmentForm(false)} variant="ghost" size="sm">Annuler</Button>
                </div>
              </div>
            )}

            {assessments.length === 0 && !showAssessmentForm ? (
              <p className="text-lumi-muted text-sm text-center py-4">
                Aucun bilan rédigé. Créez le premier bilan de cet élève !
              </p>
            ) : (
              <div className="space-y-4">
                {assessments.map(a => (
                  <div key={a.id} className="bg-gray-50 rounded-2xl p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <p className="font-bold text-sm text-lumi-text">{a.summary}</p>
                      <span className="text-xs text-lumi-muted ml-2 flex-shrink-0">{new Date(a.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                    {a.strengths && (
                      <div><span className="text-xs font-bold text-lumi-green">✅ Points forts : </span><span className="text-xs text-lumi-text">{a.strengths}</span></div>
                    )}
                    {a.difficulties && (
                      <div><span className="text-xs font-bold text-red-500">⚠️ Difficultés : </span><span className="text-xs text-lumi-text">{a.difficulties}</span></div>
                    )}
                    {a.recommendations && (
                      <div><span className="text-xs font-bold text-lumi-blue">💡 Recommandations : </span><span className="text-xs text-lumi-text">{a.recommendations}</span></div>
                    )}
                    {a.next_adjustments && (
                      <div><span className="text-xs font-bold text-lumi-purple">🔧 Ajustements : </span><span className="text-xs text-lumi-text">{a.next_adjustments}</span></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Notes pédagogiques */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black text-lumi-text">Notes pédagogiques</h2>
              <Button onClick={() => setShowNoteForm(!showNoteForm)} size="sm" variant="secondary">
                <Plus className="w-4 h-4 mr-1" />
                Ajouter
              </Button>
            </div>

            {showNoteForm && (
              <div className="bg-lumi-purple-light rounded-2xl p-4 mb-4 space-y-4">
                <textarea
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  rows={3}
                  placeholder="Observations sur l'élève, progrès, difficultés…"
                  className="w-full border-2 border-white rounded-2xl p-3 text-sm resize-none focus:outline-none focus:border-lumi-purple"
                />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-lumi-text block mb-1">Concentration (1–5)</label>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(v => (
                        <button
                          key={v}
                          onClick={() => setConcentration(v)}
                          className={cn(
                            'w-8 h-8 rounded-lg text-sm font-bold border-2 transition-all',
                            concentration === v ? 'bg-lumi-purple border-lumi-purple text-white' : 'bg-white border-gray-200 text-lumi-muted'
                          )}
                        >{v}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-lumi-text block mb-1">Taux de réussite (%)</label>
                    <input
                      type="number"
                      min={0} max={100}
                      value={successRate ?? ''}
                      onChange={e => setSuccessRate(e.target.value ? parseInt(e.target.value) : undefined)}
                      className="w-full border-2 border-white rounded-xl p-2 text-sm focus:outline-none focus:border-lumi-purple"
                      placeholder="Ex: 75"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={saveNote} loading={savingNote} size="sm">
                    <Save className="w-4 h-4 mr-1" />
                    Enregistrer
                  </Button>
                  <Button onClick={() => setShowNoteForm(false)} variant="ghost" size="sm">Annuler</Button>
                </div>
              </div>
            )}

            {notes.length === 0 ? (
              <p className="text-lumi-muted text-sm text-center py-4">
                Aucune note pour l'instant. Ajoutez votre première observation !
              </p>
            ) : (
              <div className="space-y-3">
                {notes.map(note => (
                  <div key={note.id} className="bg-gray-50 rounded-2xl p-4">
                    <p className="text-sm text-lumi-text">{note.note}</p>
                    <div className="flex gap-4 mt-2 text-xs text-lumi-muted">
                      {note.concentration_level && <span>🎯 Concentration : {note.concentration_level}/5</span>}
                      {note.success_rate && <span>✅ Réussite : {note.success_rate}%</span>}
                      <span className="ml-auto">{new Date(note.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Badges */}
          {badges.length > 0 && (
            <Card>
              <h2 className="text-xl font-black text-lumi-text mb-4">Badges obtenus</h2>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {badges.map(sb => sb.badge && (
                  <BadgeCard key={sb.id} badge={sb.badge} unlocked size="sm" />
                ))}
              </div>
            </Card>
          )}
        </div>
      </AppLayout>
    </RoleGuard>
  )
}
