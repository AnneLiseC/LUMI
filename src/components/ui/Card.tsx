import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  glass?: boolean
}

export function Card({ children, className, padding = 'md', glass = false }: CardProps) {
  const paddings = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' }
  return (
    <div
      className={cn(
        'rounded-3xl border transition-colors',
        glass
          ? 'bg-white/5 backdrop-blur-xl border-white/10 shadow-card-dark'
          : 'bg-white border-slate-100 shadow-card dark:bg-slate-900 dark:border-slate-800 dark:shadow-card-dark',
        paddings[padding],
        className
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('mb-4', className)}>{children}</div>
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h2 className={cn('text-xl font-black text-lumi-text dark:text-slate-100', className)}>{children}</h2>
}
