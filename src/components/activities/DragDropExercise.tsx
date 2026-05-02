'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { FeedbackMessage } from '@/components/ui/FeedbackMessage'
import { cn } from '@/lib/utils'

interface DragItem {
  id: string
  label?: string
  name?: string
  emoji?: string
  target?: string
  correct_folder?: string
}

interface DragDropContent {
  items?: DragItem[]
  folders?: string[]
  files?: DragItem[]
}

interface DragDropExerciseProps {
  content: DragDropContent
  xpReward: number
  onComplete: (score: number) => void
}

export function DragDropExercise({ content, xpReward, onComplete }: DragDropExerciseProps) {
  const isFileOrganizer = !!content.files
  const items = content.files ?? content.items ?? []
  const targets = content.folders ?? items.map(i => i.target ?? '').filter(Boolean)

  const [placements, setPlacements] = useState<Record<string, string>>({})
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState<Record<string, boolean>>({})

  const unplaced = items.filter(item => !placements[item.id])

  const handleDrop = (targetFolder: string) => {
    if (!draggedItem) return
    setPlacements(prev => ({ ...prev, [draggedItem]: targetFolder }))
    setDraggedItem(null)
  }

  const handleSubmit = () => {
    const newResults: Record<string, boolean> = {}
    items.forEach(item => {
      const placed = placements[item.id]
      const correct = item.correct_folder ?? item.target
      newResults[item.id] = placed === correct
    })
    setResults(newResults)
    setSubmitted(true)
    const correct = Object.values(newResults).filter(Boolean).length
    const score = Math.round((correct / items.length) * 100)
    onComplete(score)
  }

  const correctCount = submitted ? Object.values(results).filter(Boolean).length : 0

  if (submitted) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-5xl mb-3">{correctCount === items.length ? '🎉' : '💪'}</div>
          <h3 className="text-xl font-black text-lumi-text">
            {correctCount} / {items.length} corrects !
          </h3>
        </div>

        <div className="space-y-2">
          {items.map(item => (
            <div
              key={item.id}
              className={cn(
                'flex items-center gap-3 p-3 rounded-2xl border-2',
                results[item.id] ? 'bg-lumi-green-light border-lumi-green' : 'bg-red-50 border-red-200'
              )}
            >
              <span>{results[item.id] ? '✅' : '❌'}</span>
              <span className="font-semibold text-sm flex-1">{item.label ?? item.name ?? item.id}</span>
              <span className="text-xs text-lumi-muted">→ {item.correct_folder ?? item.target}</span>
            </div>
          ))}
        </div>

        <FeedbackMessage
          type={correctCount === items.length ? 'success' : 'encouragement'}
          message={correctCount === items.length ? 'Parfait ! Tu es un pro du rangement ! 📁' : 'Bien essayé ! Regarde les corrections pour progresser.'}
          xpGained={xpReward}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Unplaced items */}
      {unplaced.length > 0 && (
        <div>
          <p className="text-sm font-bold text-lumi-muted mb-3">Éléments à placer :</p>
          <div className="flex flex-wrap gap-2">
            {unplaced.map(item => (
              <button
                key={item.id}
                draggable
                onDragStart={() => setDraggedItem(item.id)}
                onClick={() => setDraggedItem(draggedItem === item.id ? null : item.id)}
                className={cn(
                  'px-4 py-2 rounded-xl border-2 font-semibold text-sm transition-all cursor-grab active:cursor-grabbing',
                  draggedItem === item.id
                    ? 'border-lumi-blue bg-lumi-blue text-white shadow-lg scale-105'
                    : 'border-lumi-blue-light bg-white text-lumi-text hover:border-lumi-blue hover:bg-lumi-blue-light'
                )}
              >
                {item.emoji && <span className="mr-1">{item.emoji}</span>}
                {item.label ?? item.name ?? item.id}
              </button>
            ))}
          </div>
          {draggedItem && (
            <p className="text-xs text-lumi-blue font-semibold mt-2">
              💡 Clique sur un dossier pour y placer l'élément sélectionné
            </p>
          )}
        </div>
      )}

      {/* Drop zones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {targets.map(target => {
          const placed = items.filter(i => placements[i.id] === target)
          return (
            <div
              key={target}
              onDragOver={e => e.preventDefault()}
              onDrop={() => handleDrop(target)}
              onClick={() => draggedItem && handleDrop(target)}
              className={cn(
                'min-h-24 rounded-2xl border-2 border-dashed p-4 transition-all cursor-pointer',
                draggedItem
                  ? 'border-lumi-blue bg-lumi-blue-light hover:bg-blue-100'
                  : 'border-gray-200 bg-gray-50',
                placed.length > 0 && 'border-lumi-green bg-lumi-green-light'
              )}
            >
              <p className="font-bold text-sm text-lumi-text mb-2">📁 {target}</p>
              <div className="flex flex-wrap gap-1">
                {placed.map(item => (
                  <button
                    key={item.id}
                    onClick={e => {
                      e.stopPropagation()
                      setPlacements(prev => {
                        const next = { ...prev }
                        delete next[item.id]
                        return next
                      })
                    }}
                    className="px-2 py-1 bg-white rounded-lg text-xs font-semibold border border-lumi-green text-green-700 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors"
                    title="Cliquer pour retirer"
                  >
                    {item.label ?? item.name ?? item.id} ×
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {unplaced.length === 0 && (
        <Button onClick={handleSubmit} className="w-full" size="lg">
          ✅ Vérifier mon rangement
        </Button>
      )}
    </div>
  )
}
