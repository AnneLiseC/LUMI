'use client'

import { getLevelForXp, getXpProgress } from '@/types'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface XPBarProps {
  xp: number
  className?: string
  compact?: boolean
}

export function XPBar({ xp, className, compact = false }: XPBarProps) {
  const level = getLevelForXp(xp)
  const percent = getXpProgress(xp)

  if (compact) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <span className="text-xs font-black text-lumi-purple dark:text-lumi-purple">Niv.{level.level}</span>
        <div className="flex-1 h-2 bg-lumi-purple-light dark:bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-lumi-purple to-lumi-blue rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          />
        </div>
        <span className="text-xs text-lumi-muted dark:text-slate-400 font-semibold">{xp} XP</span>
      </div>
    )
  }

  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex justify-between items-center">
        <span className="text-sm font-black text-lumi-purple dark:text-lumi-purple">
          Niveau {level.level} — {level.name}
        </span>
        <span className="text-sm text-lumi-muted dark:text-slate-400 font-semibold">{xp} XP</span>
      </div>
      <div className="h-4 bg-lumi-purple-light dark:bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, #A78BFA 0%, #6C9FFF 50%, #22D3EE 100%)',
            boxShadow: '0 0 12px rgba(167,139,250,0.6)',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
        />
      </div>
      <div className="flex justify-between text-xs text-lumi-muted dark:text-slate-500">
        <span>{level.minXp} XP</span>
        <span>{percent}% vers niveau {Math.min(level.level + 1, 5)}</span>
        <span>{level.maxXp} XP</span>
      </div>
    </div>
  )
}
