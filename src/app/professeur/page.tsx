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
import { Search } from 'lucide-react'

interface StudentWithProfile extends Student {
  profile: Profile
  completed_count: number
  badges_count: number
}

export default function ProfesseurDashboard() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [students, setStudents] = useState<StudentWithProfile[]>([])
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(prof)

      const { data: links } = await supabase
        .from('teacher_students')
        .select('student_id')
        .eq('teacher_id', user.id)

      if (links && links.length > 0) {
        const ids = links.map(l => l.student_id)
        const { data: stus } = await supabase
          .from('students')
          .select('*, profile:profiles(*)')
          .in('id', ids)

        const enriched = await Promise.all(
          (stus ?? []).map(async stu => {
            const [prog, badges] = await Promise.all([
              supabase.from('student_activity_progress').select('id', { count: 'exact' }).eq('student_id', stu.id).eq('status', 'completed'),
              supabase.from('student_badges').select('id', { count: 'exact' }).eq('student_id', stu.id),
            ])
            return { ...stu, completed_count: prog.count ?? 0, badges_count: badges.count ?? 0 }
          })
        )
        setStudents(enriched)
      }
      setLoading(false)
    }
    load()
  }, [])

  const filtered = students.filter(s => {
    const name = `${s.profile?.first_name} ${s.profile?.last_name}`.toLowerCase()
    return name.includes(filter.toLowerCase())
  })

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

  return (
    <RoleGuard allowedRoles={['teacher']}>
      <AppLayout role="teacher" userName={profile?.first_name}>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-black text-lumi-text">Mes élèves 👨‍🏫</h1>
            <p className="text-lumi-muted mt-1">
              {students.length} élève{students.length > 1 ? 's' : ''} suivi{students.length > 1 ? 's' : ''}
            </p>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card padding="sm">
              <div className="text-center">
                <div className="text-2xl font-black text-lumi-purple">{students.length}</div>
                <div className="text-xs text-lumi-muted">Élèves</div>
              </div>
            </Card>
            <Card padding="sm">
              <div className="text-center">
                <div className="text-2xl font-black text-lumi-blue">
                  {students.reduce((sum, s) => sum + s.completed_count, 0)}
                </div>
                <div className="text-xs text-lumi-muted">Activités complétées</div>
              </div>
            </Card>
            <Card padding="sm">
              <div className="text-center">
                <div className="text-2xl font-black text-lumi-green">
                  {students.reduce((sum, s) => sum + s.xp, 0)}
                </div>
                <div className="text-xs text-lumi-muted">XP total</div>
              </div>
            </Card>
          </div>

          {/* Search */}
          {students.length > 0 && (
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-lumi-muted" />
              <input
                value={filter}
                onChange={e => setFilter(e.target.value)}
                placeholder="Rechercher un élève…"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-lumi-purple text-sm"
              />
            </div>
          )}

          {/* Students list */}
          {filtered.length === 0 ? (
            <Card>
              <div className="text-center py-10">
                <div className="text-5xl mb-4">🎓</div>
                <h2 className="text-xl font-black text-lumi-text">Aucun élève</h2>
                <p className="text-lumi-muted mt-2">
                  {students.length === 0
                    ? 'Demandez à l\'administrateur de lier vos élèves à votre compte.'
                    : 'Aucun élève ne correspond à votre recherche.'}
                </p>
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              {filtered.map(student => {
                const level = getLevelForXp(student.xp)
                return (
                  <Link key={student.id} href={`/professeur/eleve/${student.id}`}>
                    <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer" padding="sm">
                      <div className="flex items-center gap-4 p-2">
                        <div className="w-12 h-12 rounded-2xl bg-lumi-purple-light flex items-center justify-center text-2xl flex-shrink-0">
                          🧒
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="font-black text-lumi-text">
                              {student.profile?.first_name} {student.profile?.last_name}
                            </h3>
                            <span className="text-xs font-bold px-2 py-1 rounded-lg bg-lumi-purple-light text-lumi-purple flex-shrink-0">
                              Niv. {level.level}
                            </span>
                          </div>
                          <div className="mt-1">
                            <XPBar xp={student.xp} compact />
                          </div>
                          <div className="flex gap-4 mt-2 text-xs text-lumi-muted">
                            <span>✅ {student.completed_count} activités</span>
                            <span>🏅 {student.badges_count} badges</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </AppLayout>
    </RoleGuard>
  )
}
