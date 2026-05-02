import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h${m}` : `${h}h`
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

export const POSITIVE_FEEDBACK = [
  'Bravo, tu avances ! 🌟',
  'Bonne tentative, on réessaie autrement. 💪',
  'Tu as pris le temps de réfléchir. ✨',
  'Super, tu as terminé cette mission ! 🎉',
  'Ce n\'est pas grave de se tromper, c\'est comme ça qu\'on apprend. 😊',
  'Tu progresses à chaque étape ! 🚀',
  'Excellent travail ! Continue comme ça. 👏',
  'Tu as fait de ton mieux, c\'est l\'essentiel ! ⭐',
]

export function getRandomFeedback(): string {
  return POSITIVE_FEEDBACK[Math.floor(Math.random() * POSITIVE_FEEDBACK.length)]
}
