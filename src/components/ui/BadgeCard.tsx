'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import type { Badge } from '@/types'

interface BadgeCardProps {
  badge: Badge
  unlocked?: boolean
  unlockedAt?: string
  size?: 'sm' | 'md' | 'lg'
}

export function BadgeCard({ badge, unlocked = false, unlockedAt, size = 'md' }: BadgeCardProps) {
  const sizes = {
    sm: { card: 'p-2 gap-1', icon: 'text-2xl', name: 'text-xs', desc: 'hidden' },
    md: { card: 'p-4 gap-2', icon: 'text-3xl', name: 'text-sm', desc: 'text-xs' },
    lg: { card: 'p-5 gap-3', icon: 'text-4xl', name: 'text-base', desc: 'text-sm' },
  }
  const s = sizes[size]

  return (
    <motion.div
      whileHover={unlocked ? { y: -4, scale: 1.04 } : {}}
      transition={{ type: 'spring', stiffness: 300 }}
      className={cn(
        'flex flex-col items-center text-center rounded-2xl border-2 transition-all duration-300',
        s.card,
        unlocked
          ? 'bg-white dark:bg-slate-800 border-lumi-yellow dark:border-lumi-yellow/60 shadow-md dark:shadow-card-dark'
          : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 opacity-40 grayscale'
      )}
    >
      <div className={cn(s.icon, !unlocked && 'opacity-40')}>{badge.icon}</div>
      <div className={cn('font-black text-lumi-text dark:text-slate-100', s.name)}>{badge.name}</div>
      {size !== 'sm' && (
        <div className={cn('text-lumi-muted dark:text-slate-400 leading-tight', s.desc)}>{badge.description}</div>
      )}
      {unlocked && unlockedAt && size === 'lg' && (
        <div className="text-xs text-lumi-green font-bold mt-1">✓ Débloqué !</div>
      )}
    </motion.div>
  )
}
