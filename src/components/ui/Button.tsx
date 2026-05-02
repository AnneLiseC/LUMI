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
      primary: 'bg-lumi-blue text-white hover:bg-blue-500 active:bg-blue-600',
      secondary: 'bg-lumi-purple text-white hover:bg-purple-500 active:bg-purple-600',
      success: 'bg-lumi-green text-white hover:bg-green-500 active:bg-green-600',
      danger: 'bg-red-400 text-white hover:bg-red-500 active:bg-red-600',
      ghost: 'bg-transparent border-2 border-lumi-blue text-lumi-blue hover:bg-lumi-blue-light',
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
          'font-bold transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-lumi-blue/40',
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
