'use client'

import { cn } from '@/lib/utils'
import type { Badge } from '@/types'
import { motion } from 'framer-motion'

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
      className={cn(
        'flex flex-col items-center text-center rounded-2xl border-2 transition-all duration-300',
        s.card,
        unlocked
          ? 'bg-white border-lumi-yellow shadow-md cursor-pointer'
          : 'bg-gray-50 border-gray-200 opacity-50 grayscale'
      )}
      whileHover={unlocked ? { scale: 1.08, y: -4 } : undefined}
      whileTap={unlocked ? { scale: 0.95 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
    >
      <div className={cn(s.icon, !unlocked && 'opacity-40')}>{badge.icon}</div>
      <div className={cn('font-bold text-lumi-text', s.name)}>{badge.name}</div>
      {size !== 'sm' && (
        <div className={cn('text-lumi-muted leading-tight', s.desc)}>{badge.description}</div>
      )}
      {unlocked && unlockedAt && size === 'lg' && (
        <div className="text-xs text-lumi-green font-semibold mt-1">
          ✓ Débloqué !
        </div>
      )}
    </motion.div>
  )
}
