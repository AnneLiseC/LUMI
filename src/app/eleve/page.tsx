'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { StudentLayout } from '@/components/layout/StudentLayout'
import { RoleGuard } from '@/components/layout/RoleGuard'
import { XPBar } from '@/components/ui/XPBar'
import { BadgeCard } from '@/components/ui/BadgeCard'
import { Card } from '@/components/ui/Card'
import { useStudentData } from '@/hooks/useStudentData'
import Link from 'next/link'
import { getLevelForXp } from '@/types'
import type { Student, Profile, Badge, StudentBadge } from '@/types'

export default function EleveDashboard() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [student, setStudent] = useState<Student | null>(null)
  const [allBadges, setAllBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [profileRes, badgesRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('badges').select('*').order('condition_value'),
      ])

      setProfile(profileRes.data)
      setAllBadges(badgesRes.data ?? [])

      if (profileRes.data?.role === 'student') {
        const { data: stu } = await supabase
          .from('students')
          .select('*, student_badges(*, badge:badges(*))')
          .eq('profile_id', user.id)
          .single()
        setStudent(stu)
      }

      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <RoleGuard allowedRoles={['student']}>
        <StudentLayout>
          <div className="flex items-center justify-center h-64">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 border-4 border-lumi-blue border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-lumi-muted font-semibold">Chargement…</p>
            </div>
          </div>
        </StudentLayout>
      </RoleGuard>
    )
  }

  const xp = student?.xp ?? 0
  const level = getLevelForXp(xp)
  const studentBadges = (student as (Student & { student_badges?: StudentBadge[] }) | null)?.student_badges ?? []
  const unlockedBadgeIds = new Set(studentBadges.map((sb: StudentBadge) => sb.badge_id))

  return (
    <RoleGuard allowedRoles={['student']}>
      <StudentLayout student={student ?? undefined}>
        <div className="space-y-6">
          {/* Welcome */}
          <div className="bg-gradient-to-r from-lumi-blue to-lumi-purple rounded-3xl p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-4xl">
                ⭐
              </div>
              <div>
                <h1 className="text-2xl font-black">
                  Bonjour, {profile?.first_name || 'Champion'} ! 👋
                </h1>
                <p className="opacity-90 font-semibold">
                  Niveau {level.level} — {level.name}
                </p>
                <p className="opacity-75 text-sm mt-0.5">
                  Continue comme ça, tu avances !
                </p>
              </div>
            </div>
            <div className="mt-5">
              <XPBar xp={xp} className="[&>div]:bg-white/20 [&_*]:!text-white [&_.bg-gradient-to-r]:opacity-80" />
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/eleve/parcours"
              className="bg-lumi-blue-light border-2 border-lumi-blue rounded-3xl p-5 text-center hover:shadow-md hover:-translate-y-1 transition-all group"
            >
              <div className="text-4xl mb-2 group-hover:animate-bounce">🗺️</div>
              <div className="font-black text-lumi-blue text-lg">Mon parcours</div>
              <div className="text-sm text-lumi-muted mt-1">Voir toutes les séances</div>
            </Link>

            <Link href="/eleve/projet"
              className="bg-lumi-purple-light border-2 border-lumi-purple rounded-3xl p-5 text-center hover:shadow-md hover:-translate-y-1 transition-all group"
            >
              <div className="text-4xl mb-2 group-hover:animate-bounce">🏆</div>
              <div className="font-black text-lumi-purple text-lg">Mon projet</div>
              <div className="text-sm text-lumi-muted mt-1">Assistant de devoirs</div>
            </Link>

            <div className="bg-lumi-yellow-light border-2 border-lumi-yellow rounded-3xl p-5 text-center">
              <div className="text-4xl mb-2">⭐</div>
              <div className="font-black text-yellow-700 text-lg">{xp} XP</div>
              <div className="text-sm text-lumi-muted mt-1">Points d'expérience</div>
            </div>
          </div>

          {/* Badges */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black text-lumi-text">Mes badges</h2>
              <span className="text-sm text-lumi-muted font-semibold">
                {unlockedBadgeIds.size} / {allBadges.length}
              </span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {allBadges.map(badge => (
                <BadgeCard
                  key={badge.id}
                  badge={badge}
                  unlocked={unlockedBadgeIds.has(badge.id)}
                  size="sm"
                />
              ))}
            </div>
          </Card>

          {/* Stats */}
          <Card>
            <h2 className="text-xl font-black text-lumi-text mb-4">Mes statistiques</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-black text-lumi-blue">{student?.level ?? 1}</div>
                <div className="text-xs text-lumi-muted font-semibold mt-1">Niveau</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-lumi-green">{unlockedBadgeIds.size}</div>
                <div className="text-xs text-lumi-muted font-semibold mt-1">Badges</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-lumi-purple">{xp}</div>
                <div className="text-xs text-lumi-muted font-semibold mt-1">XP Total</div>
              </div>
            </div>
          </Card>
        </div>
      </StudentLayout>
    </RoleGuard>
  )
}
