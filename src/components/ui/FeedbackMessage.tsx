'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface FeedbackMessageProps {
  type: 'success' | 'encouragement' | 'info'
  message: string
  xpGained?: number
  className?: string
}

export function FeedbackMessage({ type, message, xpGained, className }: FeedbackMessageProps) {
  const styles = {
    success: 'bg-lumi-green-light border-lumi-green text-green-800 dark:bg-lumi-green/10 dark:border-lumi-green/40 dark:text-lumi-green',
    encouragement: 'bg-lumi-yellow-light border-lumi-yellow text-yellow-800 dark:bg-lumi-yellow/10 dark:border-lumi-yellow/40 dark:text-lumi-yellow',
    info: 'bg-lumi-blue-light border-lumi-blue text-blue-800 dark:bg-lumi-blue/10 dark:border-lumi-blue/40 dark:text-lumi-blue',
  }
  const icons = { success: '🎉', encouragement: '💪', info: '💡' }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn('rounded-2xl border-2 p-4 flex items-start gap-3', styles[type], className)}
    >
      <span className="text-2xl flex-shrink-0">{icons[type]}</span>
      <div className="flex-1">
        <p className="font-semibold leading-snug">{message}</p>
        {xpGained !== undefined && xpGained > 0 && (
          <p className="text-sm font-black mt-1 text-lumi-purple">+{xpGained} XP ⚡</p>
        )}
      </div>
    </motion.div>
  )
}
