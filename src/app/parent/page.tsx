'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AppLayout } from '@/components/layout/AppLayout'
import { RoleGuard } from '@/components/layout/RoleGuard'
import { Card } from '@/components/ui/Card'
import { XPBar } from '@/components/ui/XPBar'
import Link from 'next/link'
import type { Profile, Student } from '@/types'
import { getLevelForXp } from '@/types'
import { Users, TrendingUp, Clock, Award } from 'lucide-react'

interface StudentWithProfile extends Student {
  profile: Profile
  badges_count?: number
  completed_activities?: number
}

export default function ParentDashboard() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [children, setChildren] = useState<StudentWithProfile[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setProfile(prof)

      // Get linked students
      const { data: links } = await supabase
        .from('parent_students')
        .select('student_id')
        .eq('parent_id', user.id)

      if (links && links.length > 0) {
        const studentIds = links.map(l => l.student_id)
        const { data: students } = await supabase
          .from('students')
          .select('*, profile:profiles(*)')
          .in('id', studentIds)

        // Get badges and progress counts
        const enriched = await Promise.all(
          (students ?? []).map(async (stu) => {
            const [badgesRes, progRes] = await Promise.all([
              supabase.from('student_badges').select('id', { count: 'exact' }).eq('student_id', stu.id),
              supabase.from('student_activity_progress').select('id', { count: 'exact' }).eq('student_id', stu.id).eq('status', 'completed'),
            ])
            return {
              ...stu,
              badges_count: badgesRes.count ?? 0,
              completed_activities: progRes.count ?? 0,
            }
          })
        )
        setChildren(enriched)
      }

      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
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

  return (
    <RoleGuard allowedRoles={['parent']}>
      <AppLayout role="parent" userName={profile?.first_name}>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-lumi-text">
              Bonjour, {profile?.first_name} ! 👋
            </h1>
            <p className="text-lumi-muted mt-1">
              Suivez la progression de vos enfants sur LUMI.
            </p>
          </div>

          {children.length === 0 ? (
            <Card>
              <div className="text-center py-10 space-y-4">
                <div className="text-5xl">👧</div>
                <h2 className="text-xl font-black text-lumi-text">Aucun enfant lié</h2>
                <p className="text-lumi-muted max-w-sm mx-auto">
                  Demandez à l'administrateur de lier votre compte au profil de votre enfant.
                </p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {children.map(child => {
                const level = getLevelForXp(child.xp)
                return (
                  <Link key={child.id} href={`/parent/enfant/${child.id}`}>
                    <Card className="hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-lumi-green flex items-center justify-center text-3xl flex-shrink-0">
                          ⭐
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-black text-lumi-text">
                            {child.profile?.first_name} {child.profile?.last_name}
                          </h3>
                          <p className="text-sm text-lumi-muted">
                            Niveau {level.level} — {level.name}
                          </p>
                          <div className="mt-3">
                            <XPBar xp={child.xp} compact />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-100">
                        <div className="text-center">
                          <div className="text-xl font-black text-lumi-blue">{child.completed_activities}</div>
                          <div className="text-xs text-lumi-muted">Activités</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-black text-lumi-green">{child.badges_count}</div>
                          <div className="text-xs text-lumi-muted">Badges</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-black text-lumi-purple">{child.xp}</div>
                          <div className="text-xs text-lumi-muted">XP</div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                )
              })}
            </div>
          )}

          {/* Guide */}
          <Card>
            <h2 className="text-xl font-black text-lumi-text mb-4">Comment accompagner votre enfant ?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: '💬', title: 'Parlez des séances', text: 'Demandez-lui ce qu\'il a appris après chaque séance.' },
                { icon: '🎉', title: 'Célébrez les badges', text: 'Félicitez chaque badge débloqué, même les petits !' },
                { icon: '⏰', title: 'Régularité', text: 'Une séance courte par semaine vaut mieux qu\'une longue rarement.' },
                { icon: '🤔', title: 'Questionnez sans juger', text: '"Comment ça s\'est passé ?" plutôt que "Tu as réussi ?"' },
              ].map(tip => (
                <div key={tip.title} className="flex items-start gap-3 p-3 bg-lumi-green-light rounded-2xl">
                  <span className="text-2xl">{tip.icon}</span>
                  <div>
                    <p className="font-bold text-sm text-lumi-text">{tip.title}</p>
                    <p className="text-xs text-lumi-muted mt-0.5">{tip.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </AppLayout>
    </RoleGuard>
  )
}
