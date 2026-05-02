'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { FeedbackMessage } from '@/components/ui/FeedbackMessage'
import { cn } from '@/lib/utils'

interface CardItem {
  title: string
  emoji?: string
  description?: string
  examples?: string[]
  detail?: string
}

interface CardContent {
  cards?: CardItem[]
  title?: string
  analogy?: { real?: string; digital?: string; title?: string; text?: string }
  steps?: CardItem[]
  questions?: CardItem[]
  example_prompt?: string
}

interface CardExerciseProps {
  content: CardContent
  xpReward: number
  onComplete: (score: number) => void
}

export function CardExercise({ content, xpReward, onComplete }: CardExerciseProps) {
  const items = content.cards ?? content.steps ?? content.questions ?? []
  const [currentIndex, setCurrentIndex] = useState(0)
  const [seen, setSeen] = useState<Set<number>>(new Set())
  const [finished, setFinished] = useState(false)

  const markSeen = (i: number) => setSeen(prev => new Set([...prev, i]))

  const handleNext = () => {
    markSeen(currentIndex)
    if (currentIndex + 1 >= items.length) {
      setFinished(true)
      onComplete(100)
    } else {
      setCurrentIndex(i => i + 1)
    }
  }

  if (finished) {
    return (
      <div className="text-center space-y-6">
        <div className="text-5xl">📚</div>
        <h3 className="text-xl font-black text-lumi-text">Tu as vu toutes les cartes !</h3>
        <FeedbackMessage type="success" message="Super ! Tu as exploré toutes les informations. 🌟" xpGained={xpReward} />
      </div>
    )
  }

  const current = items[currentIndex]

  return (
    <div className="space-y-6">
      {/* Analogy block */}
      {content.analogy && currentIndex === 0 && (
        <div className="bg-lumi-yellow-light rounded-3xl p-5 border-2 border-lumi-yellow">
          <h3 className="font-black text-lumi-text text-base mb-3">
            {content.analogy.title ?? '💡 Pour comprendre'}
          </h3>
          {content.analogy.text && (
            <p className="text-lumi-text leading-relaxed">{content.analogy.text}</p>
          )}
          {content.analogy.real && (
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="bg-white rounded-2xl p-3 text-center">
                <div className="text-2xl mb-1">📚</div>
                <p className="text-sm font-semibold text-lumi-text">{content.analogy.real}</p>
              </div>
              <div className="bg-white rounded-2xl p-3 text-center">
                <div className="text-2xl mb-1">💻</div>
                <p className="text-sm font-semibold text-lumi-text">{content.analogy.digital}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Progress */}
      <div className="flex gap-1.5">
        {items.map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-2 flex-1 rounded-full transition-all',
              seen.has(i) ? 'bg-lumi-green' : i === currentIndex ? 'bg-lumi-blue' : 'bg-gray-200'
            )}
          />
        ))}
      </div>

      {/* Card */}
      <div className="bg-white rounded-3xl border-2 border-lumi-blue-light p-6 shadow-sm min-h-48 flex flex-col items-center justify-center text-center space-y-4">
        {current.emoji && <div className="text-5xl">{current.emoji}</div>}
        <h3 className="text-xl font-black text-lumi-text">{current.title}</h3>
        {current.description && (
          <p className="text-lumi-muted leading-relaxed">{current.description}</p>
        )}
        {current.detail && (
          <p className="text-sm text-lumi-muted italic">{current.detail}</p>
        )}
        {current.examples && current.examples.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {current.examples.map((ex, i) => (
              <span key={i} className="px-3 py-1 bg-lumi-blue-light text-lumi-blue rounded-xl text-sm font-semibold">
                {ex}
              </span>
            ))}
          </div>
        )}
      </div>

      {content.example_prompt && currentIndex === items.length - 1 && (
        <div className="bg-lumi-green-light rounded-2xl p-4 border-2 border-lumi-green">
          <p className="text-sm font-bold text-green-800 mb-2">✨ Exemple de prompt complet :</p>
          <p className="text-sm text-green-700 italic">"{content.example_prompt}"</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-sm text-lumi-muted">{currentIndex + 1} / {items.length}</span>
        <Button onClick={handleNext} size="md">
          {currentIndex + 1 >= items.length ? '✅ Terminé !' : 'Carte suivante →'}
        </Button>
      </div>
    </div>
  )
}
