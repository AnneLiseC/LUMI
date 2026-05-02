'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { StudentLayout } from '@/components/layout/StudentLayout'
import { RoleGuard } from '@/components/layout/RoleGuard'
import { SessionCard } from '@/components/ui/SessionCard'
import type { Session, Student, StudentActivityProgress } from '@/types'

export default function ParcoursPage() {
  const [student, setStudent] = useState<Student | null>(null)
  const [sessions, setSessions] = useState<Session[]>([])
  const [progress, setProgress] = useState<StudentActivityProgress[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: stu } = await supabase
        .from('students')
        .select('*')
        .eq('profile_id', user.id)
        .single()

      setStudent(stu)

      const [sessionsRes, progressRes] = await Promise.all([
        supabase.from('sessions').select('*, activities(*)').order('order_index'),
        stu ? supabase.from('student_activity_progress').select('*').eq('student_id', stu.id) : Promise.resolve({ data: [] }),
      ])

      setSessions(sessionsRes.data ?? [])
      setProgress(progressRes.data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const getSessionProgress = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId)
    if (!session?.activities) return { completed: 0, total: 0 }
    const total = session.activities.length
    const completed = session.activities.filter(a =>
      progress.find(p => p.activity_id === a.id && p.status === 'completed')
    ).length
    return { completed, total }
  }

  const isSessionUnlocked = (index: number): boolean => {
    if (index === 0) return true
    const prev = sessions[index - 1]
    if (!prev) return false
    const { completed, total } = getSessionProgress(prev.id)
    return total > 0 && completed >= Math.ceil(total * 0.6)
  }

  const groupedSessions: Record<string, Session[]> = {}
  sessions.forEach(s => {
    if (!groupedSessions[s.block_name]) groupedSessions[s.block_name] = []
    groupedSessions[s.block_name].push(s)
  })

  if (loading) {
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

  return (
    <RoleGuard allowedRoles={['student']}>
      <StudentLayout student={student ?? undefined}>
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-lumi-text">Mon parcours 🗺️</h1>
            <p className="text-lumi-muted mt-1">Suis les séances dans l'ordre pour progresser !</p>
          </div>

          {Object.entries(groupedSessions).map(([blockName, blockSessions]) => (
            <div key={blockName} className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-sm font-black text-lumi-muted px-3 py-1.5 bg-white rounded-full border border-gray-200">
                  {blockName}
                </span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {blockSessions.map((session, i) => {
                  const globalIndex = sessions.findIndex(s => s.id === session.id)
                  const { completed, total } = getSessionProgress(session.id)
                  const isUnlocked = isSessionUnlocked(globalIndex)

                  return (
                    <SessionCard
                      key={session.id}
                      session={session}
                      completed={completed}
                      total={total}
                      isUnlocked={isUnlocked}
                      isActive={student?.current_session_id === session.id}
                    />
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </StudentLayout>
    </RoleGuard>
  )
}
