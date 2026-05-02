'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { FeedbackMessage } from '@/components/ui/FeedbackMessage'
import { cn } from '@/lib/utils'
import { GripVertical, ChevronUp, ChevronDown } from 'lucide-react'

interface OrderContent {
  title?: string
  steps: string[]
  scenarios?: { id: string; title: string; steps: string[] }[]
}

interface OrderExerciseProps {
  content: OrderContent
  xpReward: number
  onComplete: (score: number) => void
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

export function OrderExercise({ content, xpReward, onComplete }: OrderExerciseProps) {
  const correctSteps = content.steps
  const [items, setItems] = useState<string[]>(() => shuffle(correctSteps))
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...items]
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    if (swapIndex < 0 || swapIndex >= items.length) return;
    [newItems[index], newItems[swapIndex]] = [newItems[swapIndex], newItems[index]]
    setItems(newItems)
  }

  const handleSubmit = () => {
    const correct = items.every((item, i) => item === correctSteps[i])
    setIsCorrect(correct)
    setSubmitted(true)
    onComplete(correct ? 100 : Math.max(20, Math.round((items.filter((item, i) => item === correctSteps[i]).length / items.length) * 100)))
  }

  if (submitted) {
    return (
      <div className="space-y-5">
        <div className="text-center">
          <div className="text-5xl mb-3">{isCorrect ? '🎉' : '💪'}</div>
          <h3 className="text-xl font-black text-lumi-text">
            {isCorrect ? 'Parfait ordre !' : 'Voici le bon ordre :'}
          </h3>
        </div>

        <div className="space-y-2">
          {correctSteps.map((step, i) => (
            <div
              key={i}
              className={cn(
                'flex items-center gap-3 p-3 rounded-2xl border-2',
                items[i] === step ? 'bg-lumi-green-light border-lumi-green' : 'bg-red-50 border-red-200'
              )}
            >
              <span className="w-7 h-7 rounded-lg bg-white flex items-center justify-center font-black text-sm text-lumi-blue">
                {i + 1}
              </span>
              <span className="font-semibold text-sm">{step}</span>
              {items[i] !== step && <span className="ml-auto text-red-400 text-xs">✗</span>}
              {items[i] === step && <span className="ml-auto text-lumi-green text-xs">✓</span>}
            </div>
          ))}
        </div>

        <FeedbackMessage
          type={isCorrect ? 'success' : 'encouragement'}
          message={isCorrect ? 'Tu connais parfaitement l\'ordre des étapes ! 🌟' : 'C\'est bien ! Regarde le bon ordre pour mémoriser.'}
          xpGained={xpReward}
        />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {content.title && (
        <div className="bg-lumi-blue-light rounded-2xl p-4 text-center">
          <p className="font-bold text-lumi-text">{content.title}</p>
        </div>
      )}

      <p className="text-sm text-lumi-muted text-center">
        Utilise les flèches ↑↓ pour remettre les étapes dans le bon ordre.
      </p>

      <div className="space-y-2">
        {items.map((item, i) => (
          <div
            key={item}
            className="flex items-center gap-3 bg-white border-2 border-gray-200 rounded-2xl p-4 shadow-sm"
          >
            <GripVertical className="w-4 h-4 text-gray-300 flex-shrink-0" />
            <span className="w-7 h-7 rounded-lg bg-lumi-blue-light flex items-center justify-center font-black text-sm text-lumi-blue flex-shrink-0">
              {i + 1}
            </span>
            <span className="flex-1 font-semibold text-lumi-text text-sm">{item}</span>
            <div className="flex flex-col gap-0.5">
              <button
                onClick={() => moveItem(i, 'up')}
                disabled={i === 0}
                className="p-1 rounded-lg hover:bg-lumi-blue-light disabled:opacity-30 transition-colors"
              >
                <ChevronUp className="w-4 h-4 text-lumi-blue" />
              </button>
              <button
                onClick={() => moveItem(i, 'down')}
                disabled={i === items.length - 1}
                className="p-1 rounded-lg hover:bg-lumi-blue-light disabled:opacity-30 transition-colors"
              >
                <ChevronDown className="w-4 h-4 text-lumi-blue" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Button onClick={handleSubmit} className="w-full" size="lg">
        ✅ Vérifier mon ordre
      </Button>
    </div>
  )
}
