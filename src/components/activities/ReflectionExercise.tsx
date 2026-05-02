'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { FeedbackMessage } from '@/components/ui/FeedbackMessage'

interface ReflectionContent {
  prompts?: string[]
  tasks?: { id: string; label: string; placeholder?: string }[]
  min_length?: number
}

interface ReflectionExerciseProps {
  content: ReflectionContent
  xpReward: number
  onComplete: (score: number) => void
  type?: 'reflection' | 'editor'
}

export function ReflectionExercise({ content, xpReward, onComplete, type = 'reflection' }: ReflectionExerciseProps) {
  const prompts = content.prompts ?? content.tasks?.map(t => t.label) ?? []
  const [answers, setAnswers] = useState<string[]>(new Array(prompts.length).fill(''))
  const [submitted, setSubmitted] = useState(false)
  const minLength = content.min_length ?? 10

  const allFilled = answers.every(a => a.trim().length >= minLength)

  const handleSubmit = () => {
    setSubmitted(true)
    onComplete(100)
  }

  if (submitted) {
    return (
      <div className="space-y-4">
        <FeedbackMessage
          type="success"
          message="Super ! Tu as pris le temps de réfléchir et d'écrire tes idées. ✨"
          xpGained={xpReward}
        />
        <div className="space-y-3">
          {prompts.map((prompt, i) => (
            <div key={i} className="bg-white rounded-2xl border-2 border-lumi-green-light p-4">
              <p className="text-sm font-bold text-lumi-muted mb-1">{prompt}</p>
              <p className="text-base text-lumi-text">{answers[i]}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {prompts.map((prompt, i) => (
        <div key={i} className="space-y-2">
          <label className="block text-base font-bold text-lumi-text">
            {i + 1}. {prompt}
          </label>
          <textarea
            value={answers[i]}
            onChange={e => {
              const next = [...answers]
              next[i] = e.target.value
              setAnswers(next)
            }}
            rows={3}
            placeholder={content.tasks?.[i]?.placeholder ?? 'Écris ta réponse ici…'}
            className="w-full border-2 border-gray-200 rounded-2xl p-4 text-base resize-none focus:outline-none focus:border-lumi-blue transition-colors"
          />
          <div className="flex justify-between text-xs text-lumi-muted">
            <span>
              {answers[i].trim().length < minLength
                ? `Encore ${minLength - answers[i].trim().length} caractères minimum`
                : '✓ C\'est bien !'}
            </span>
            <span>{answers[i].length} caractères</span>
          </div>
        </div>
      ))}

      <Button onClick={handleSubmit} disabled={!allFilled} className="w-full" size="lg">
        ✅ Valider mes réponses
      </Button>

      {!allFilled && (
        <p className="text-center text-sm text-lumi-muted">
          💡 Écris au moins {minLength} caractères pour chaque réponse.
        </p>
      )}
    </div>
  )
}
