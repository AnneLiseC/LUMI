'use client'

import { cn } from '@/lib/utils'

interface DyslexiaToggleProps {
  enabled: boolean
  onToggle: () => void
  className?: string
}

export function DyslexiaToggle({ enabled, onToggle, className }: DyslexiaToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-2xl border-2 transition-all text-sm font-bold',
        enabled
          ? 'border-lumi-purple bg-lumi-purple text-white shadow-glow'
          : 'border-lumi-purple/40 bg-lumi-purple-light text-lumi-purple hover:border-lumi-purple dark:bg-lumi-purple/10 dark:border-lumi-purple/30 dark:text-lumi-purple dark:hover:border-lumi-purple',
        className
      )}
      title={enabled ? 'Désactiver le mode dyslexie' : 'Activer le mode dyslexie'}
    >
      <span className="text-base">👁️</span>
      <span className="hidden sm:inline">{enabled ? 'Dys ON' : 'Dys'}</span>
    </button>
  )
}
