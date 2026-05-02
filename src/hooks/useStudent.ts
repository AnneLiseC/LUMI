'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Student, Session, StudentActivityProgress, StudentBadge } from '@/types'
import { getLevelForXp } from '@/types'

export function useStudentData(studentId: string | undefined) {
  const [sessions, setSessions] = useState<Session[]>([])
  const [progress, setProgress] = useState<StudentActivityProgress[]>([])
  const [badges, setBadges] = useState<StudentBadge[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const loadData = useCallback(async () => {
    if (!studentId) return

    const [sessionsRes, progressRes, badgesRes] = await Promise.all([
      supabase.from('sessions').select('*, activities(*)').order('order_index'),
      supabase.from('student_activity_progress').select('*').eq('student_id', studentId),
      supabase.from('student_badges').select('*, badge:badges(*)').eq('student_id', studentId),
    ])

    if (sessionsRes.data) setSessions(sessionsRes.data)
    if (progressRes.data) setProgress(progressRes.data)
    if (badgesRes.data) setBadges(badgesRes.data)
    setLoading(false)
  }, [studentId])

  useEffect(() => { loadData() }, [loadData])

  const completeActivity = async (
    activityId: string,
    xpReward: number,
    score?: number,
    timeSpent?: number
  ) => {
    if (!studentId) return

    const existing = progress.find(p => p.activity_id === activityId)

    if (existing) {
      await supabase
        .from('student_activity_progress')
        .update({
          status: 'completed',
          score: score ?? existing.score,
          attempts: existing.attempts + 1,
          time_spent_seconds: (existing.time_spent_seconds ?? 0) + (timeSpent ?? 0),
          completed_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
    } else {
      await supabase.from('student_activity_progress').insert({
        student_id: studentId,
        activity_id: activityId,
        status: 'completed',
        score: score ?? null,
        attempts: 1,
        time_spent_seconds: timeSpent ?? 0,
        completed_at: new Date().toISOString(),
      })

      // Award XP
      const { data: stu } = await supabase
        .from('students')
        .select('xp')
        .eq('id', studentId)
        .single()

      if (stu) {
        const newXp = stu.xp + xpReward
        const newLevel = getLevelForXp(newXp).level
        await supabase
          .from('students')
          .update({ xp: newXp, level: newLevel })
          .eq('id', studentId)
      }
    }

    await loadData()
  }

  const getSessionProgress = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId)
    if (!session?.activities) return { completed: 0, total: 0, percent: 0 }
    const total = session.activities.length
    const completed = session.activities.filter(a =>
      progress.find(p => p.activity_id === a.id && p.status === 'completed')
    ).length
    return { completed, total, percent: total > 0 ? Math.round((completed / total) * 100) : 0 }
  }

  return { sessions, progress, badges, loading, completeActivity, getSessionProgress, reload: loadData }
}
