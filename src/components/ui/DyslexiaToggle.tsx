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
        'flex items-center gap-2 px-3 py-2 rounded-2xl border-2 transition-all text-sm font-semibold',
        enabled
          ? 'border-lumi-purple bg-lumi-purple text-white'
          : 'border-lumi-purple-light bg-lumi-purple-light text-lumi-purple hover:border-lumi-purple',
        className
      )}
      title={enabled ? 'Désactiver le changement de typologie' : 'Activer le changement de typologie'}
    >
      <span className="text-base">👁️</span>
      <span className="hidden sm:inline">{enabled ? 'Changement de typologie ON' : 'Changement de typologie'}</span>
    </button>
  )
}
