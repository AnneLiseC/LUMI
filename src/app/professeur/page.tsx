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
import { Search, AlertTriangle, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StudentWithProfile extends Student {
  profile: Profile
  completed_count: number
  badges_count: number
  last_active: string | null
}

type SortKey = 'xp' | 'name' | 'last_active' | 'completion'

export default function ProfesseurDashboard() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [students, setStudents] = useState<StudentWithProfile[]>([])
  const [filter, setFilter] = useState('')
  const [sort, setSort] = useState<SortKey>('last_active')
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
            const [prog, badges, lastAct] = await Promise.all([
              supabase.from('student_activity_progress').select('id', { count: 'exact' }).eq('student_id', stu.id).eq('status', 'completed'),
              supabase.from('student_badges').select('id', { count: 'exact' }).eq('student_id', stu.id),
              supabase.from('student_activity_progress').select('completed_at').eq('student_id', stu.id).eq('status', 'completed').order('completed_at', { ascending: false }).limit(1),
            ])
            return {
              ...stu,
              completed_count: prog.count ?? 0,
              badges_count: badges.count ?? 0,
              last_active: lastAct.data?.[0]?.completed_at ?? null,
            }
          })
        )
        setStudents(enriched)
      }
      setLoading(false)
    }
    load()
  }, [])

  const inactiveDays = (lastActive: string | null) => {
    if (!lastActive) return null
    const diff = Date.now() - new Date(lastActive).getTime()
    return Math.floor(diff / (1000 * 60 * 60 * 24))
  }

  const formatLastActive = (lastActive: string | null) => {
    if (!lastActive) return 'Jamais connecté'
    const days = inactiveDays(lastActive)!
    if (days === 0) return 'Aujourd\'hui'
    if (days === 1) return 'Hier'
    if (days < 7) return `Il y a ${days} jours`
    if (days < 30) return `Il y a ${Math.floor(days / 7)} semaine${Math.floor(days / 7) > 1 ? 's' : ''}`
    return `Il y a ${Math.floor(days / 30)} mois`
  }

  const sorted = [...students]
    .filter(s => {
      const name = `${s.profile?.first_name} ${s.profile?.last_name}`.toLowerCase()
      return name.includes(filter.toLowerCase())
    })
    .sort((a, b) => {
      if (sort === 'xp') return b.xp - a.xp
      if (sort === 'name') return `${a.profile?.first_name}`.localeCompare(`${b.profile?.first_name}`)
      if (sort === 'completion') return b.completed_count - a.completed_count
      // last_active: null (never active) goes last, most recent first
      if (sort === 'last_active') {
        if (!a.last_active && !b.last_active) return 0
        if (!a.last_active) return 1
        if (!b.last_active) return -1
        return new Date(b.last_active).getTime() - new Date(a.last_active).getTime()
      }
      return 0
    })

  const inactiveCount = students.filter(s => {
    const days = inactiveDays(s.last_active)
    return days === null || days >= 7
  }).length

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
            <h1 className="text-2xl sm:text-3xl font-black text-lumi-text">Mes élèves 👨‍🏫</h1>
            <p className="text-lumi-muted mt-1">
              {students.length} élève{students.length > 1 ? 's' : ''} suivi{students.length > 1 ? 's' : ''}
            </p>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-3">
            <Card padding="sm">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-black text-lumi-purple">{students.length}</div>
                <div className="text-xs text-lumi-muted">Élèves</div>
              </div>
            </Card>
            <Card padding="sm">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-black text-lumi-blue">
                  {students.reduce((sum, s) => sum + s.completed_count, 0)}
                </div>
                <div className="text-xs text-lumi-muted leading-tight">Activités<br className="sm:hidden" /> complétées</div>
              </div>
            </Card>
            <Card padding="sm">
              <div className="text-center">
                <div className={cn('text-xl sm:text-2xl font-black', inactiveCount > 0 ? 'text-orange-500' : 'text-lumi-green')}>
                  {inactiveCount}
                </div>
                <div className="text-xs text-lumi-muted">Inactifs +7j</div>
              </div>
            </Card>
          </div>

          {/* Inactivity alert */}
          {inactiveCount > 0 && (
            <div className="flex items-center gap-3 bg-orange-50 border-2 border-orange-200 rounded-2xl px-4 py-3">
              <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0" />
              <p className="text-sm font-semibold text-orange-700">
                {inactiveCount} élève{inactiveCount > 1 ? 's' : ''} n'a pas travaillé depuis plus de 7 jours.
              </p>
            </div>
          )}

          {/* Search + Sort */}
          {students.length > 0 && (
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-lumi-muted" />
                <input
                  value={filter}
                  onChange={e => setFilter(e.target.value)}
                  placeholder="Rechercher un élève…"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-lumi-purple text-sm"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs font-bold text-lumi-muted self-center">Trier :</span>
                {([
                  { key: 'last_active', label: 'Dernière activité' },
                  { key: 'xp', label: 'XP' },
                  { key: 'completion', label: 'Activités' },
                  { key: 'name', label: 'Nom' },
                ] as { key: SortKey; label: string }[]).map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => setSort(opt.key)}
                    className={cn(
                      'px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all',
                      sort === opt.key
                        ? 'bg-lumi-purple border-lumi-purple text-white'
                        : 'bg-white border-gray-200 text-lumi-muted hover:border-lumi-purple'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Students list */}
          {sorted.length === 0 ? (
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
              {sorted.map(student => {
                const level = getLevelForXp(student.xp)
                const days = inactiveDays(student.last_active)
                const isInactive = days === null || days >= 7
                const isVeryInactive = days === null || days >= 14
                return (
                  <Link key={student.id} href={`/professeur/eleve/${student.id}`}>
                    <Card
                      className={cn(
                        'hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer',
                        isVeryInactive ? 'border-red-200' : isInactive ? 'border-orange-200' : ''
                      )}
                      padding="sm"
                    >
                      <div className="flex items-center gap-4 p-2">
                        <div className={cn(
                          'w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0',
                          isVeryInactive ? 'bg-red-50' : isInactive ? 'bg-orange-50' : 'bg-lumi-purple-light'
                        )}>
                          {isVeryInactive ? '😴' : isInactive ? '⏰' : '🧒'}
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
                          <div className="flex items-center gap-4 mt-2 text-xs text-lumi-muted flex-wrap">
                            <span>✅ {student.completed_count} activités</span>
                            <span>🏅 {student.badges_count} badges</span>
                            <span className={cn(
                              'flex items-center gap-1',
                              isVeryInactive ? 'text-red-500 font-bold' : isInactive ? 'text-orange-500 font-semibold' : ''
                            )}>
                              {isInactive && <Clock className="w-3 h-3" />}
                              {formatLastActive(student.last_active)}
                            </span>
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
