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
import type { Student, Profile, Badge, StudentBadge, Assessment, StudentActivityProgress } from '@/types'
import { motion } from 'framer-motion'

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.1 } } },
  item: {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  },
}

export default function EleveDashboard() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [student, setStudent] = useState<Student | null>(null)
  const [allBadges, setAllBadges] = useState<Badge[]>([])
  const [latestAssessment, setLatestAssessment] = useState<Assessment | null>(null)
  const [commentedProgress, setCommentedProgress] = useState<(StudentActivityProgress & { teacher_comment: string })[]>([])
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

        if (stu) {
          const [assessRes, progRes] = await Promise.all([
            supabase.from('assessments').select('*').eq('student_id', stu.id).order('created_at', { ascending: false }).limit(1),
            supabase.from('student_activity_progress').select('id, activity_id, teacher_comment').eq('student_id', stu.id).not('teacher_comment', 'is', null),
          ])
          setLatestAssessment(assessRes.data?.[0] ?? null)
          setCommentedProgress((progRes.data ?? []).filter(p => p.teacher_comment) as (StudentActivityProgress & { teacher_comment: string })[])
        }
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
            <div className="w-12 h-12 border-4 border-lumi-purple border-t-transparent rounded-full animate-spin" />
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
        <motion.div
          className="space-y-6"
          variants={stagger.container}
          initial="initial"
          animate="animate"
        >
          {/* Welcome */}
          <motion.div variants={stagger.item} className="bg-gradient-to-r from-lumi-blue to-lumi-purple rounded-3xl p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-4xl">
                ⭐
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black">
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
          </motion.div>

          {/* Quick actions */}
          <motion.div variants={stagger.item} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
          </motion.div>

          {/* Badges */}
          <motion.div variants={stagger.item}>
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
          </motion.div>

          {/* Teacher feedback */}
          {(latestAssessment || commentedProgress.length > 0) && (
            <motion.div variants={stagger.item}>
              <Card>
                <h2 className="text-xl font-black text-lumi-text mb-4">📬 Retours de mon prof</h2>
                <div className="space-y-3">
                  {latestAssessment && (
                    <div className="bg-lumi-purple-light rounded-2xl p-4 space-y-2">
                      <p className="text-xs font-bold text-lumi-purple uppercase tracking-wide">Bilan pédagogique</p>
                      <p className="text-sm font-semibold text-lumi-text">{latestAssessment.summary}</p>
                      {latestAssessment.strengths && (
                        <p className="text-xs text-lumi-text"><span className="font-bold text-lumi-green">✅ Points forts : </span>{latestAssessment.strengths}</p>
                      )}
                      {latestAssessment.difficulties && (
                        <p className="text-xs text-lumi-text"><span className="font-bold text-orange-500">💪 À améliorer : </span>{latestAssessment.difficulties}</p>
                      )}
                      {latestAssessment.recommendations && (
                        <p className="text-xs text-lumi-text"><span className="font-bold text-lumi-blue">💡 Conseil : </span>{latestAssessment.recommendations}</p>
                      )}
                    </div>
                  )}
                  {commentedProgress.map(p => (
                    <div key={p.id} className="bg-lumi-blue-light rounded-2xl p-3 flex gap-3 items-start">
                      <span className="text-xl flex-shrink-0">💬</span>
                      <p className="text-sm text-lumi-text">{p.teacher_comment}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Stats */}
          <motion.div variants={stagger.item}>
          <Card>
            <h2 className="text-xl font-black text-lumi-text mb-4">Mes statistiques</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-black text-lumi-blue">{student?.level ?? 1}</div>
                <div className="text-xs text-lumi-muted font-semibold mt-1">Niveau</div>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {allBadges.map(badge => (
                  <BadgeCard key={badge.id} badge={badge} unlocked={unlockedBadgeIds.has(badge.id)} size="sm" />
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Stats */}
          <motion.div variants={stagger.item}>
            <Card>
              <h2 className="text-xl font-black text-lumi-text dark:text-slate-100 mb-4">Mes stats 📊</h2>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: student?.level ?? 1, label: 'Niveau', color: 'text-lumi-blue' },
                  { value: unlockedBadgeIds.size, label: 'Badges', color: 'text-lumi-green' },
                  { value: xp, label: 'XP Total', color: 'text-lumi-purple' },
                ].map(stat => (
                  <motion.div
                    key={stat.label}
                    whileHover={{ scale: 1.05 }}
                    className="text-center p-3 rounded-2xl bg-lumi-cream dark:bg-slate-800 border border-slate-100 dark:border-slate-700"
                  >
                    <motion.div
                      className={`text-3xl font-black ${stat.color}`}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5, type: 'spring' }}
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-xs text-lumi-muted dark:text-slate-400 font-bold mt-1">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
          </motion.div>
        </motion.div>
      </StudentLayout>
    </RoleGuard>
  )
}
