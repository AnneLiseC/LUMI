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
import { motion } from 'framer-motion'
import { stagger } from '@/components/ui/PageWrapper'
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
          variants={stagger.container}
          initial="hidden"
          animate="show"
          className="space-y-5"
        >
          {/* Welcome hero */}
          <motion.div variants={stagger.item}>
            <div className="relative rounded-3xl p-6 overflow-hidden text-white"
              style={{ background: 'linear-gradient(135deg, #A78BFA 0%, #6C9FFF 50%, #22D3EE 100%)' }}>
              <div className="absolute inset-0 bg-black/5" />
              {/* Decorative blobs */}
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 blur-xl" />
              <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-white/10 blur-xl" />
              <div className="relative flex items-start gap-4">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-4xl flex-shrink-0"
                >
                  ⭐
                </motion.div>
                <div className="flex-1">
                  <h1 className="text-2xl font-black tracking-tight">
                    Bonjour, {profile?.first_name || 'Champion'} ! 👋
                  </h1>
                  <p className="opacity-90 font-semibold text-sm mt-0.5">
                    Niveau {level.level} — {level.name}
                  </p>
                  <div className="mt-4">
                    <XPBar xp={xp} className="[&>div:first-child]:text-white [&>span]:text-white/80" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick actions */}
          <motion.div variants={stagger.item} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                href: '/eleve/parcours', emoji: '🗺️', label: 'Mon parcours',
                sub: 'Voir toutes les séances',
                gradient: 'from-lumi-blue/15 to-lumi-blue/5',
                border: 'border-lumi-blue/30 hover:border-lumi-blue',
                text: 'text-lumi-blue',
              },
              {
                href: '/eleve/projet', emoji: '🏆', label: 'Mon projet',
                sub: 'Assistant de devoirs',
                gradient: 'from-lumi-purple/15 to-lumi-purple/5',
                border: 'border-lumi-purple/30 hover:border-lumi-purple',
                text: 'text-lumi-purple',
              },
              {
                href: '#', emoji: '⭐', label: `${xp} XP`,
                sub: 'Points gagnés',
                gradient: 'from-lumi-yellow/20 to-lumi-yellow/5',
                border: 'border-lumi-yellow/40 hover:border-lumi-yellow',
                text: 'text-amber-600 dark:text-lumi-yellow',
              },
            ].map((item, i) => (
              <motion.div key={item.label} whileHover={{ y: -6, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}>
                <Link
                  href={item.href}
                  className={`block bg-gradient-to-b ${item.gradient} border-2 ${item.border} rounded-3xl p-5 text-center transition-all`}
                >
                  <motion.div
                    className="text-4xl mb-2"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }}
                  >
                    {item.emoji}
                  </motion.div>
                  <div className={`font-black text-lg ${item.text}`}>{item.label}</div>
                  <div className="text-sm text-lumi-muted dark:text-slate-400 mt-0.5">{item.sub}</div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Badges */}
          <motion.div variants={stagger.item}>
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-black text-lumi-text dark:text-slate-100">Mes badges 🏅</h2>
                <span className="text-sm text-lumi-muted dark:text-slate-400 font-bold bg-lumi-purple-light dark:bg-lumi-purple/20 text-lumi-purple px-3 py-1 rounded-xl">
                  {unlockedBadgeIds.size} / {allBadges.length}
                </span>
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
            </Card>
          </motion.div>
        </motion.div>
      </StudentLayout>
    </RoleGuard>
  )
}
