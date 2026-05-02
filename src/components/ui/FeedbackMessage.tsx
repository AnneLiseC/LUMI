'use client'

import { cn } from '@/lib/utils'

interface FeedbackMessageProps {
  type: 'success' | 'encouragement' | 'info'
  message: string
  xpGained?: number
  className?: string
}

export function FeedbackMessage({ type, message, xpGained, className }: FeedbackMessageProps) {
  const styles = {
    success: 'bg-lumi-green-light border-lumi-green text-green-800',
    encouragement: 'bg-lumi-yellow-light border-lumi-yellow text-yellow-800',
    info: 'bg-lumi-blue-light border-lumi-blue text-blue-800',
  }

  const icons = { success: '🎉', encouragement: '💪', info: '💡' }

  return (
    <div className={cn('rounded-2xl border-2 p-4 flex items-start gap-3', styles[type], className)}>
      <span className="text-2xl flex-shrink-0">{icons[type]}</span>
      <div className="flex-1">
        <p className="font-semibold leading-snug">{message}</p>
        {xpGained !== undefined && xpGained > 0 && (
          <p className="text-sm font-bold mt-1 text-lumi-purple">
            +{xpGained} XP gagnés ! ⚡
          </p>
        )}
      </div>
    </div>
  )
}
