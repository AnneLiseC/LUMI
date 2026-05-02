'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AppLayout } from '@/components/layout/AppLayout'
import { RoleGuard } from '@/components/layout/RoleGuard'
import { Card } from '@/components/ui/Card'
import { XPBar } from '@/components/ui/XPBar'
import { BadgeCard } from '@/components/ui/BadgeCard'
import { cn, formatDate } from '@/lib/utils'
import type { Student, Profile, Session, StudentActivityProgress, StudentBadge } from '@/types'
import { getLevelForXp } from '@/types'
import { ChevronLeft, CheckCircle } from 'lucide-react'

export default function EnfantDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [student, setStudent] = useState<Student | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [sessions, setSessions] = useState<Session[]>([])
  const [progress, setProgress] = useState<StudentActivityProgress[]>([])
  const [badges, setBadges] = useState<StudentBadge[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const [stuRes, sessRes] = await Promise.all([
        supabase.from('students').select('*, profile:profiles(*)').eq('id', id).single(),
        supabase.from('sessions').select('*, activities(*)').order('order_index'),
      ])

      setStudent(stuRes.data)
      setProfile(stuRes.data?.profile ?? null)
      setSessions(sessRes.data ?? [])

      if (stuRes.data) {
        const [progRes, badgesRes] = await Promise.all([
          supabase.from('student_activity_progress').select('*').eq('student_id', id),
          supabase.from('student_badges').select('*, badge:badges(*)').eq('student_id', id),
        ])
        setProgress(progRes.data ?? [])
        setBadges(badgesRes.data ?? [])
      }

      setLoading(false)
    }
    load()
  }, [id])

  if (loading || !student) {
    return (
      <RoleGuard allowedRoles={['parent']}>
        <AppLayout role="parent">
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-lumi-green border-t-transparent rounded-full animate-spin" />
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
    const completed = session.activities.filter(a =>
      progress.find(p => p.activity_id === a.id && p.status === 'completed')
    ).length
    return { completed, total, percent: total > 0 ? Math.round((completed / total) * 100) : 0 }
  }

  return (
    <RoleGuard allowedRoles={['parent']}>
      <AppLayout role="parent">
        <div className="space-y-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-lumi-muted hover:text-lumi-blue font-semibold text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            Retour
          </button>

          {/* Header */}
          <div className="bg-gradient-to-r from-lumi-green-light to-lumi-blue-light rounded-3xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-lumi-green flex items-center justify-center text-3xl">
                ⭐
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-black text-lumi-text">
                  {profile?.first_name} {profile?.last_name}
                </h1>
                <p className="text-lumi-muted">Niveau {level.level} — {level.name}</p>
              </div>
            </div>
            <div className="mt-4">
              <XPBar xp={student.xp} />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'XP Total', value: student.xp, color: 'text-lumi-purple', emoji: '⚡' },
              { label: 'Activités', value: completedActivities, color: 'text-lumi-blue', emoji: '✅' },
              { label: 'Badges', value: badges.length, color: 'text-lumi-green', emoji: '🏅' },
            ].map(stat => (
              <Card key={stat.label} padding="sm">
                <div className="text-center">
                  <div className="text-xl">{stat.emoji}</div>
                  <div className={cn('text-2xl font-black mt-1', stat.color)}>{stat.value}</div>
                  <div className="text-xs text-lumi-muted">{stat.label}</div>
                </div>
              </Card>
            ))}
          </div>

          {/* Session progress */}
          <Card>
            <h2 className="text-xl font-black text-lumi-text mb-4">Progression des séances</h2>
            <div className="space-y-3">
              {sessions.map(session => {
                const { completed, total, percent } = getSessionStatus(session)
                return (
                  <div key={session.id} className="flex items-center gap-4">
                    <div className={cn(
                      'w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0',
                      percent === 100 ? 'bg-lumi-green text-white' : percent > 0 ? 'bg-lumi-blue text-white' : 'bg-gray-100 text-gray-400'
                    )}>
                      {percent === 100 ? '✓' : session.session_number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold text-lumi-text truncate">{session.title}</span>
                        <span className="text-lumi-muted ml-2 flex-shrink-0">{completed}/{total}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full bg-lumi-green rounded-full transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Badges */}
          {badges.length > 0 && (
            <Card>
              <h2 className="text-xl font-black text-lumi-text mb-4">Badges obtenus 🏅</h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {badges.map(sb => sb.badge && (
                  <BadgeCard
                    key={sb.id}
                    badge={sb.badge}
                    unlocked
                    unlockedAt={sb.unlocked_at}
                    size="md"
                  />
                ))}
              </div>
            </Card>
          )}
        </div>
      </AppLayout>
    </RoleGuard>
  )
}
