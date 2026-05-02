'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { FeedbackMessage } from '@/components/ui/FeedbackMessage'
import { cn } from '@/lib/utils'

interface EmotionQuestion {
  id: string
  text: string
  emoji: string
}

interface EmotionContent {
  questions: EmotionQuestion[]
  scale: Record<string, string>
}

interface EmotionExerciseProps {
  content: EmotionContent
  xpReward: number
  onComplete: (score: number) => void
}

export function EmotionExercise({ content, xpReward, onComplete }: EmotionExerciseProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState(false)

  const allAnswered = content.questions.every(q => answers[q.id] !== undefined)
  const scaleKeys = Object.keys(content.scale)

  const handleSubmit = () => {
    setSubmitted(true)
    onComplete(100)
  }

  if (submitted) {
    return (
      <div className="space-y-4">
        <FeedbackMessage
          type="success"
          message="Merci d'avoir partagé comment tu te sens ! Ça nous aide beaucoup. 💛"
          xpGained={xpReward}
        />
        <div className="space-y-3">
          {content.questions.map(q => (
            <div key={q.id} className="bg-white rounded-2xl p-4 border-2 border-lumi-yellow-light flex items-center gap-3">
              <span className="text-2xl">{q.emoji}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-lumi-text">{q.text}</p>
                <p className="text-sm text-lumi-purple font-bold">
                  {content.scale[answers[q.id]]} ({answers[q.id]}/5)
                </p>
              </div>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(v => (
                  <div
                    key={v}
                    className={cn(
                      'w-3 h-3 rounded-full',
                      v <= answers[q.id] ? 'bg-lumi-yellow' : 'bg-gray-200'
                    )}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {content.questions.map(q => (
        <div key={q.id} className="bg-white rounded-3xl p-5 border-2 border-gray-100 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{q.emoji}</span>
            <p className="font-bold text-lumi-text text-base leading-snug">{q.text}</p>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {scaleKeys.map((key) => {
              const val = parseInt(key)
              const isSelected = answers[q.id] === val
              return (
                <button
                  key={key}
                  onClick={() => setAnswers(prev => ({ ...prev, [q.id]: val }))}
                  className={cn(
                    'flex flex-col items-center gap-1 p-2 rounded-2xl border-2 transition-all text-center',
                    isSelected
                      ? 'border-lumi-yellow bg-lumi-yellow-light text-lumi-text font-bold scale-105'
                      : 'border-gray-200 bg-gray-50 text-lumi-muted hover:border-lumi-yellow hover:bg-lumi-yellow-light'
                  )}
                >
                  <span className="text-lg font-black">{val}</span>
                  <span className="text-xs leading-tight hidden sm:block">{content.scale[key]}</span>
                </button>
              )
            })}
          </div>
          <div className="flex justify-between text-xs text-lumi-muted px-1">
            <span>{content.scale[scaleKeys[0]]}</span>
            <span>{content.scale[scaleKeys[scaleKeys.length - 1]]}</span>
          </div>
        </div>
      ))}

      <Button onClick={handleSubmit} disabled={!allAnswered} className="w-full" size="lg">
        ✅ Valider mon ressenti
      </Button>
    </div>
  )
}
