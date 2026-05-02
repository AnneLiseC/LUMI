'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/Button'
import { FeedbackMessage } from '@/components/ui/FeedbackMessage'
import { cn } from '@/lib/utils'

interface TypingContent {
  text: string
  target_wpm?: number
  show_timer?: boolean
}

interface TypingExerciseProps {
  content: TypingContent
  xpReward: number
  onComplete: (score: number, timeSpent: number) => void
}

export function TypingExercise({ content, xpReward, onComplete }: TypingExerciseProps) {
  const [typed, setTyped] = useState('')
  const [started, setStarted] = useState(false)
  const [finished, setFinished] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const timerRef = useRef<NodeJS.Timeout>()

  const target = content.text
  const words = target.split(' ').length

  const calculateStats = useCallback(() => {
    const timeMinutes = elapsed / 60
    const wpm = timeMinutes > 0 ? Math.round(words / timeMinutes) : 0
    let correct = 0
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] === target[i]) correct++
    }
    const accuracy = typed.length > 0 ? Math.round((correct / typed.length) * 100) : 0
    return { wpm, accuracy }
  }, [elapsed, words, typed, target])

  useEffect(() => {
    if (started && !finished) {
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [started, finished])

  useEffect(() => {
    if (typed === target && typed.length > 0) {
      clearInterval(timerRef.current)
      setFinished(true)
      const { accuracy } = calculateStats()
      onComplete(accuracy, elapsed)
    }
  }, [typed, target])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    if (!started && value.length > 0) {
      setStarted(true)
      setStartTime(Date.now())
    }
    if (value.length <= target.length) {
      setTyped(value)
    }
  }

  const getCharClass = (index: number): string => {
    if (index >= typed.length) return 'text-gray-400'
    return typed[index] === target[index] ? 'text-green-600 bg-green-50' : 'text-red-500 bg-red-50'
  }

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

  if (finished) {
    const { wpm, accuracy } = calculateStats()
    return (
      <div className="text-center space-y-6 py-8">
        <div className="text-6xl">⌨️</div>
        <h3 className="text-2xl font-black text-lumi-text">Texte complété !</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Précision', value: `${accuracy}%`, color: 'text-lumi-green' },
            { label: 'Vitesse', value: `${wpm} mpm`, color: 'text-lumi-blue' },
            { label: 'Temps', value: formatTime(elapsed), color: 'text-lumi-purple' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className={cn('text-2xl font-black', stat.color)}>{stat.value}</div>
              <div className="text-xs text-lumi-muted font-semibold mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
        <FeedbackMessage
          type={accuracy >= 80 ? 'success' : 'encouragement'}
          message={accuracy >= 80 ? 'Excellent ! Tu tapes avec précision. ⌨️✨' : 'C\'est bien ! Continue à pratiquer, tu vas progresser. 💪'}
          xpGained={xpReward}
        />
      </div>
    )
  }

  const progress = Math.round((typed.length / target.length) * 100)

  return (
    <div className="space-y-6">
      {content.show_timer && (
        <div className="flex items-center justify-between text-sm">
          <span className="font-bold text-lumi-muted">⏱ {formatTime(elapsed)}</span>
          <span className="font-bold text-lumi-blue">{progress}%</span>
        </div>
      )}

      {/* Progress bar */}
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-lumi-blue to-lumi-purple rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Reference text */}
      <div className="bg-lumi-blue-light rounded-3xl p-6 font-mono text-xl leading-relaxed tracking-wide">
        {target.split('').map((char, i) => (
          <span key={i} className={cn('rounded transition-colors', getCharClass(i))}>
            {char}
          </span>
        ))}
        {typed.length < target.length && (
          <span className="animate-pulse border-l-2 border-lumi-blue ml-0.5">&nbsp;</span>
        )}
      </div>

      {/* Input */}
      <textarea
        ref={inputRef}
        value={typed}
        onChange={handleChange}
        autoFocus
        rows={3}
        className="w-full border-2 border-lumi-blue-light rounded-2xl p-4 text-base font-mono resize-none focus:outline-none focus:border-lumi-blue transition-colors"
        placeholder="Commence à taper ici… Tu peux y aller à ton rythme 🙂"
      />

      <p className="text-center text-sm text-lumi-muted">
        💡 Tape exactement le texte affiché. Pas de pression, prends ton temps !
      </p>
    </div>
  )
}
