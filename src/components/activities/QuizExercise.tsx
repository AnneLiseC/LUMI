'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { FeedbackMessage } from '@/components/ui/FeedbackMessage'
import { cn } from '@/lib/utils'
import { CheckCircle, XCircle } from 'lucide-react'

interface Question {
  id: string
  text: string
  emoji?: string
  options: string[]
  correct: number
  explanation?: string
}

interface QuizContent {
  questions: Question[]
  type?: 'multiple_choice' | 'true_false'
}

interface QuizExerciseProps {
  content: QuizContent
  xpReward: number
  onComplete: (score: number) => void
}

export function QuizExercise({ content, xpReward, onComplete }: QuizExerciseProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

  const questions = content.questions
  const current = questions[currentIndex]
  const isCorrect = selected === current?.correct

  const handleSelect = (index: number) => {
    if (answered) return
    setSelected(index)
    setAnswered(true)
    setShowExplanation(true)
    if (index === current.correct) {
      setScore(s => s + 1)
    }
  }

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      setFinished(true)
      const finalScore = Math.round(((score + (isCorrect ? 1 : 0)) / questions.length) * 100)
      onComplete(finalScore)
    } else {
      setCurrentIndex(i => i + 1)
      setSelected(null)
      setAnswered(false)
      setShowExplanation(false)
    }
  }

  if (finished) {
    const finalScore = Math.round((score / questions.length) * 100)
    return (
      <div className="text-center space-y-6 py-8">
        <div className="text-6xl">{finalScore >= 70 ? '🎉' : '💪'}</div>
        <div>
          <h3 className="text-2xl font-black text-lumi-text">
            {finalScore >= 70 ? 'Excellent travail !' : 'Bonne tentative !'}
          </h3>
          <p className="text-lumi-muted mt-2">
            Tu as répondu correctement à {score} question{score > 1 ? 's' : ''} sur {questions.length}
          </p>
        </div>
        <div className="w-32 h-32 mx-auto rounded-full border-8 border-lumi-blue-light flex items-center justify-center">
          <span className="text-3xl font-black text-lumi-blue">{finalScore}%</span>
        </div>
        <FeedbackMessage
          type={finalScore >= 70 ? 'success' : 'encouragement'}
          message={finalScore >= 70 ? 'Super, tu avances ! 🌟' : 'Bonne tentative, on réessaie autrement. 💪'}
          xpGained={xpReward}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex gap-1.5">
          {questions.map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-2 rounded-full transition-all',
                i < currentIndex ? 'bg-lumi-green w-6' : i === currentIndex ? 'bg-lumi-blue w-8' : 'bg-gray-200 w-6'
              )}
            />
          ))}
        </div>
        <span className="text-sm text-lumi-muted ml-auto">
          {currentIndex + 1} / {questions.length}
        </span>
      </div>

      {/* Question */}
      <div className="bg-lumi-blue-light rounded-3xl p-6 text-center">
        {current.emoji && <div className="text-5xl mb-3">{current.emoji}</div>}
        <p className="text-xl font-bold text-lumi-text leading-snug">{current.text}</p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-3">
        {current.options.map((option, i) => {
          const isSelected = selected === i
          const isRight = i === current.correct
          let style = 'bg-white border-2 border-gray-200 text-lumi-text hover:border-lumi-blue hover:bg-lumi-blue-light'

          if (answered) {
            if (isRight) style = 'bg-lumi-green-light border-2 border-lumi-green text-green-800'
            else if (isSelected && !isRight) style = 'bg-red-50 border-2 border-red-300 text-red-800'
            else style = 'bg-gray-50 border-2 border-gray-200 text-gray-400'
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={answered}
              className={cn(
                'w-full text-left px-5 py-4 rounded-2xl font-semibold transition-all text-base flex items-center gap-3',
                style,
                !answered && 'cursor-pointer active:scale-98'
              )}
            >
              <span className="w-8 h-8 rounded-xl bg-white/60 flex items-center justify-center font-black text-sm flex-shrink-0">
                {answered && isRight ? <CheckCircle className="w-5 h-5 text-lumi-green" /> :
                 answered && isSelected && !isRight ? <XCircle className="w-5 h-5 text-red-400" /> :
                 String.fromCharCode(65 + i)}
              </span>
              {option}
            </button>
          )
        })}
      </div>

      {/* Explanation */}
      {showExplanation && current.explanation && (
        <div className={cn(
          'rounded-2xl p-4 border-2 text-sm font-medium',
          isCorrect ? 'bg-lumi-green-light border-lumi-green text-green-800' : 'bg-lumi-yellow-light border-lumi-yellow text-yellow-800'
        )}>
          <span className="mr-2">{isCorrect ? '✅' : '💡'}</span>
          {current.explanation}
        </div>
      )}

      {answered && (
        <Button onClick={handleNext} className="w-full" size="lg">
          {currentIndex + 1 >= questions.length ? '🎉 Voir mon score' : 'Question suivante →'}
        </Button>
      )}
    </div>
  )
}
