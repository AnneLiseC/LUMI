'use client'

import { useTheme } from '@/hooks/useTheme'

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-xl transition-all duration-200 hover:scale-110 ${className ?? ''}`}
      aria-label={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
      title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
    >
      <span className="text-lg select-none">
        {theme === 'dark' ? '☀️' : '🌙'}
      </span>
    </button>
  )
}
