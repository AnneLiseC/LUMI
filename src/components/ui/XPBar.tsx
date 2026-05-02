'use client'

import { getLevelForXp, getXpProgress } from '@/types'
import { cn } from '@/lib/utils'

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
        <span className="text-xs font-bold text-lumi-purple">Niv.{level.level}</span>
        <div className="flex-1 h-2 bg-lumi-purple-light rounded-full overflow-hidden">
          <div
            className="h-full bg-lumi-purple rounded-full transition-all duration-700"
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="text-xs text-lumi-muted">{xp} XP</span>
      </div>
    )
  }

  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-lumi-purple">
          Niveau {level.level} — {level.name}
        </span>
        <span className="text-sm text-lumi-muted font-semibold">{xp} XP</span>
      </div>
      <div className="h-4 bg-lumi-purple-light rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-lumi-purple to-lumi-blue rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-lumi-muted">
        <span>{level.minXp} XP</span>
        <span>{percent}% vers niveau {Math.min(level.level + 1, 5)}</span>
        <span>{level.maxXp} XP</span>
      </div>
    </div>
  )
}
