'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { FeedbackMessage } from '@/components/ui/FeedbackMessage'
import { cn } from '@/lib/utils'

interface ProjectContent {
  step: number
  title: string
  needs?: string[]
  features?: { id: string; label: string; emoji: string; description: string }[]
  mockup_elements?: Record<string, unknown>
  questions?: { id: string; label: string; placeholder?: string; min_length?: number }[]
  instruction?: string
  min_selections?: number
}

interface ProjectStepExerciseProps {
  content: ProjectContent
  xpReward: number
  onComplete: (score: number, data?: Record<string, unknown>) => void
}

export function ProjectStepExercise({ content, xpReward, onComplete }: ProjectStepExerciseProps) {
  const [selected, setSelected] = useState<string[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [mockupData, setMockupData] = useState<Record<string, string>>({
    title: 'Mon super assistant de devoirs',
    emoji: '🤖',
    color: '#5B9BD5',
  })
  const [submitted, setSubmitted] = useState(false)

  const toggle = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const minSelections = content.min_selections ?? 1
  const isStep4 = content.step === 4

  const canSubmit = isStep4
    ? content.questions?.every(q => answers[q.id]?.trim().length >= (q.min_length ?? 10))
    : selected.length >= minSelections

  const handleSubmit = () => {
    setSubmitted(true)
    onComplete(100, { selected, answers, mockupData })
  }

  if (submitted) {
    return (
      <div className="space-y-4">
        <FeedbackMessage
          type="success"
          message={`Étape ${content.step} complétée ! Tu avances vers ton assistant personnel. 🚀`}
          xpGained={xpReward}
        />
        {selected.length > 0 && (
          <div className="bg-white rounded-2xl p-4 border-2 border-lumi-green-light">
            <p className="text-sm font-bold text-lumi-muted mb-2">Tes choix :</p>
            <div className="flex flex-wrap gap-2">
              {selected.map(s => (
                <span key={s} className="px-3 py-1 bg-lumi-green-light text-green-800 rounded-xl text-sm font-semibold">
                  ✓ {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-r from-lumi-blue-light to-lumi-purple-light rounded-3xl p-5 text-center">
        <div className="text-sm font-bold text-lumi-purple mb-1">Étape {content.step} / 4</div>
        <h3 className="text-xl font-black text-lumi-text">{content.title}</h3>
        {content.instruction && (
          <p className="text-sm text-lumi-muted mt-2">{content.instruction}</p>
        )}
      </div>

      {/* Step 1 & 2: Selections */}
      {(content.needs ?? content.features) && (
        <div className="grid grid-cols-1 gap-3">
          {(content.needs ?? content.features ?? []).map((item, i) => {
            const id = typeof item === 'string' ? item : (item as { id?: string; label?: string }).id ?? (item as { id?: string; label?: string }).label ?? String(i)
            const label = typeof item === 'string' ? item : (item as { label: string }).label
            const emoji = typeof item === 'object' ? (item as { emoji?: string }).emoji : undefined
            const desc = typeof item === 'object' ? (item as { description?: string }).description : undefined
            const isSelected = selected.includes(id)

            return (
              <button
                key={id}
                onClick={() => toggle(id)}
                className={cn(
                  'text-left p-4 rounded-2xl border-2 transition-all flex items-start gap-3',
                  isSelected
                    ? 'border-lumi-blue bg-lumi-blue-light'
                    : 'border-gray-200 bg-white hover:border-lumi-blue hover:bg-lumi-blue-light/50'
                )}
              >
                <div className={cn(
                  'w-6 h-6 rounded-lg border-2 flex-shrink-0 mt-0.5 flex items-center justify-center',
                  isSelected ? 'border-lumi-blue bg-lumi-blue' : 'border-gray-300'
                )}>
                  {isSelected && <span className="text-white text-xs font-black">✓</span>}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {emoji && <span>{emoji}</span>}
                    <span className="font-bold text-lumi-text text-sm">{label}</span>
                  </div>
                  {desc && <p className="text-xs text-lumi-muted mt-0.5">{desc}</p>}
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* Step 3: Mockup */}
      {content.step === 3 && (
        <div className="space-y-4">
          <div
            className="rounded-3xl p-6 text-center space-y-4"
            style={{ backgroundColor: mockupData.color + '20', border: `2px solid ${mockupData.color}` }}
          >
            <div className="text-5xl">{mockupData.emoji || '🤖'}</div>
            <h3 className="text-xl font-black" style={{ color: mockupData.color }}>
              {mockupData.title || 'Mon assistant'}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {["J'ai une question", "Je veux réviser", "Je veux m'organiser", "Je vérifie"].map(btn => (
                <div key={btn} className="py-2 px-3 rounded-xl text-white text-sm font-bold" style={{ backgroundColor: mockupData.color }}>
                  {btn}
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <input
              type="text"
              value={mockupData.title}
              onChange={e => setMockupData(p => ({ ...p, title: e.target.value }))}
              placeholder="Nom de mon assistant"
              className="w-full border-2 border-gray-200 rounded-2xl p-3 text-base focus:outline-none focus:border-lumi-blue"
            />
            <div className="flex gap-2">
              {['🤖','⭐','🦋','🦊','🧙','🚀'].map(em => (
                <button key={em} onClick={() => setMockupData(p => ({ ...p, emoji: em }))}
                  className={cn('text-2xl p-2 rounded-xl border-2 transition-all', mockupData.emoji === em ? 'border-lumi-blue bg-lumi-blue-light' : 'border-gray-200 hover:border-lumi-blue')}>
                  {em}
                </button>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap">
              {['#5B9BD5','#7EC8A4','#B39DDB','#F5D76E','#F97316'].map(color => (
                <button key={color} onClick={() => setMockupData(p => ({ ...p, color }))}
                  className={cn('w-8 h-8 rounded-full border-4 transition-all', mockupData.color === color ? 'border-white ring-2 ring-gray-400 scale-110' : 'border-white')}
                  style={{ backgroundColor: color }} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Presentation questions */}
      {content.questions && (
        <div className="space-y-4">
          {content.questions.map(q => (
            <div key={q.id} className="space-y-2">
              <label className="block font-bold text-lumi-text text-sm">{q.label}</label>
              <textarea
                value={answers[q.id] ?? ''}
                onChange={e => setAnswers(p => ({ ...p, [q.id]: e.target.value }))}
                rows={3}
                placeholder={q.placeholder}
                className="w-full border-2 border-gray-200 rounded-2xl p-3 text-base resize-none focus:outline-none focus:border-lumi-blue"
              />
            </div>
          ))}
        </div>
      )}

      <Button onClick={handleSubmit} disabled={!canSubmit} className="w-full" size="lg">
        ✅ Valider cette étape
      </Button>
    </div>
  )
}
