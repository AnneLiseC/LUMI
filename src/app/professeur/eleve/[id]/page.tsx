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
import { ChevronLeft, Plus, Save } from 'lucide-react'
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
  const [showNoteForm, setShowNoteForm] = useState(false)
  const [noteText, setNoteText] = useState('')
  const [concentration, setConcentration] = useState(3)
  const [successRate, setSuccessRate] = useState<number | undefined>()
  const [savingNote, setSavingNote] = useState(false)
  const [loading, setLoading] = useState(true)
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

      setProgress(progRes.data ?? [])
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

  const getSessionStatus = (session: Session) => {
    if (!session.activities) return { completed: 0, total: 0, percent: 0 }
    const total = session.activities.length
    const completed = session.activities.filter((a: { id: string }) =>
      progress.find(p => p.activity_id === a.id && p.status === 'completed')
    ).length
    return { completed, total, percent: total > 0 ? Math.round((completed / total) * 100) : 0 }
  }

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
                    <label className="text-xs font-bold text-lumi-text block mb-1">
                      Concentration (1–5)
                    </label>
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
                    <label className="text-xs font-bold text-lumi-text block mb-1">
                      Taux de réussite (%)
                    </label>
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
                  <Button onClick={() => setShowNoteForm(false)} variant="ghost" size="sm">
                    Annuler
                  </Button>
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
