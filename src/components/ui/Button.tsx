import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
    const variants = {
      primary:
        'bg-gradient-to-r from-lumi-blue to-lumi-purple text-white shadow-glow-blue hover:shadow-glow hover:opacity-90',
      secondary:
        'bg-lumi-purple text-white hover:bg-purple-500 shadow-glow hover:shadow-glow',
      success:
        'bg-lumi-green text-white hover:opacity-90 shadow-glow-green',
      danger:
        'bg-red-500 text-white hover:bg-red-600',
      ghost:
        'bg-transparent border-2 border-lumi-purple text-lumi-purple hover:bg-lumi-purple-light dark:border-lumi-purple dark:text-lumi-purple dark:hover:bg-lumi-purple/10',
    }

    const sizes = {
      sm: 'px-4 py-2 text-sm rounded-xl',
      md: 'px-6 py-3 text-base rounded-2xl',
      lg: 'px-8 py-4 text-lg rounded-2xl',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'font-bold transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-lumi-purple/40',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'active:scale-95',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2 justify-center">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Chargement…
          </span>
        ) : children}
      </button>
    )
  }
)
Button.displayName = 'Button'
