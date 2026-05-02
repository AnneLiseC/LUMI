'use client'

import type { Activity } from '@/types'
import { QuizExercise } from './QuizExercise'
import { TypingExercise } from './TypingExercise'
import { DragDropExercise } from './DragDropExercise'
import { ReflectionExercise } from './ReflectionExercise'
import { EmotionExercise } from './EmotionExercise'
import { CardExercise } from './CardExercise'
import { OrderExercise } from './OrderExercise'
import { IntroExercise } from './IntroExercise'
import { ProjectStepExercise } from './ProjectStepExercise'
import { Button } from '@/components/ui/Button'
import { useState } from 'react'

interface ActivityRendererProps {
  activity: Activity
  onComplete: (score: number, timeSpent?: number, data?: Record<string, unknown>) => void
}

export function ActivityRenderer({ activity, onComplete }: ActivityRendererProps) {
  const content = activity.content as Record<string, unknown>

  const handleTypingComplete = (score: number, timeSpent: number) => {
    onComplete(score, timeSpent)
  }

  const handleProjectComplete = (score: number, data?: Record<string, unknown>) => {
    onComplete(score, undefined, data)
  }

  switch (activity.type) {
    case 'intro':
      return <IntroExercise content={content as never} xpReward={activity.xp_reward} onComplete={s => onComplete(s)} />

    case 'quiz':
      return <QuizExercise content={content as never} xpReward={activity.xp_reward} onComplete={s => onComplete(s)} />

    case 'typing':
      return <TypingExercise content={content as never} xpReward={activity.xp_reward} onComplete={handleTypingComplete} />

    case 'drag_and_drop':
      return <DragDropExercise content={content as never} xpReward={activity.xp_reward} onComplete={s => onComplete(s)} />

    case 'order':
      return <OrderExercise content={content as never} xpReward={activity.xp_reward} onComplete={s => onComplete(s)} />

    case 'reflection':
    case 'editor':
    case 'todo':
    case 'search':
      return <ReflectionExercise content={content as never} xpReward={activity.xp_reward} onComplete={s => onComplete(s)} type={activity.type as 'reflection' | 'editor'} />

    case 'emotion':
      return <EmotionExercise content={content as never} xpReward={activity.xp_reward} onComplete={s => onComplete(s)} />

    case 'card':
    case 'map':
      return <CardExercise content={content as never} xpReward={activity.xp_reward} onComplete={s => onComplete(s)} />

    case 'comparison':
      return <ComparisonExercise content={content as never} xpReward={activity.xp_reward} onComplete={s => onComplete(s)} />

    case 'flashcard':
      return <FlashcardExercise content={content as never} xpReward={activity.xp_reward} onComplete={s => onComplete(s)} />

    case 'project_step':
      return <ProjectStepExercise content={content as never} xpReward={activity.xp_reward} onComplete={handleProjectComplete} />

    default:
      return (
        <div className="text-center space-y-4 py-8">
          <div className="text-4xl">🚧</div>
          <p className="text-lumi-muted">Ce type d'activité arrive bientôt !</p>
          <Button onClick={() => onComplete(100)}>Continuer</Button>
        </div>
      )
  }
}

// Inline Comparison exercise
function ComparisonExercise({ content, xpReward, onComplete }: { content: Record<string, unknown>; xpReward: number; onComplete: (s: number) => void }) {
  const [chosen, setChosen] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const responses = (content.responses ?? content.pairs ?? []) as { id: string; label: string; text?: string; vague?: string; clear?: string; why?: string }[]
  const best = content.best as string | undefined

  if (submitted) {
    const isCorrect = !best || chosen === best
    return (
      <div className="space-y-4">
        <div className={`rounded-2xl p-4 border-2 ${isCorrect ? 'bg-lumi-green-light border-lumi-green' : 'bg-lumi-yellow-light border-lumi-yellow'}`}>
          <p className="font-bold text-base">{isCorrect ? '✅ Excellent choix !' : '💡 Voici pourquoi la meilleure réponse est différente :'}</p>
          {best && (
            <p className="text-sm mt-2 text-lumi-muted">
              {(responses.find(r => r.id === best) as { why?: string } | undefined)?.why ?? `La réponse ${best} est la meilleure.`}
            </p>
          )}
        </div>
        <div className="bg-lumi-blue-light rounded-2xl p-3 text-center text-sm font-bold text-lumi-blue">
          +{xpReward} XP gagnés ! ⚡
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {(content.prompt as string | undefined) && (
        <div className="bg-lumi-blue-light rounded-2xl p-4">
          <p className="font-bold text-lumi-text text-sm">Question posée à l'IA :</p>
          <p className="text-base mt-1 italic">"{content.prompt as string}"</p>
        </div>
      )}
      {responses.map(r => (
        <button
          key={r.id}
          onClick={() => setChosen(r.id)}
          className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${chosen === r.id ? 'border-lumi-blue bg-lumi-blue-light' : 'border-gray-200 bg-white hover:border-lumi-blue'}`}
        >
          <p className="font-bold text-sm text-lumi-purple mb-2">{r.label}</p>
          <p className="text-sm text-lumi-text leading-relaxed">{r.text ?? r.clear ?? ''}</p>
          {r.vague && <p className="text-xs text-red-400 mt-2 line-through">{r.vague}</p>}
        </button>
      ))}
      {chosen && (
        <Button onClick={() => setSubmitted(true)} className="w-full" size="lg">
          ✅ Valider mon choix
        </Button>
      )}
    </div>
  )
}

// Inline Flashcard exercise
function FlashcardExercise({ content, xpReward, onComplete }: { content: Record<string, unknown>; xpReward: number; onComplete: (s: number) => void }) {
  const exampleCards = (content.example_cards ?? []) as { front: string; back: string }[]
  const [cards, setCards] = useState<{ front: string; back: string }[]>(exampleCards)
  const [newFront, setNewFront] = useState('')
  const [newBack, setNewBack] = useState('')
  const [flipped, setFlipped] = useState<Set<number>>(new Set())
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <div className="text-center space-y-4">
        <div className="text-5xl">🃏</div>
        <p className="text-xl font-black text-lumi-text">Tes flashcards sont prêtes !</p>
        <p className="text-lumi-muted">Tu peux maintenant utiliser ces cartes pour réviser.</p>
        <div className="bg-lumi-green-light rounded-2xl p-3 text-lumi-green font-bold">+{xpReward} XP !</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm font-bold text-lumi-muted">{content.instruction as string}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {cards.map((card, i) => (
          <button
            key={i}
            onClick={() => setFlipped(f => { const next = new Set(f); f.has(i) ? next.delete(i) : next.add(i); return next })}
            className={`p-4 rounded-2xl border-2 text-left transition-all min-h-24 ${flipped.has(i) ? 'bg-lumi-green-light border-lumi-green' : 'bg-lumi-blue-light border-lumi-blue'}`}
          >
            <p className="text-xs font-bold text-lumi-muted mb-1">{flipped.has(i) ? 'Réponse :' : 'Question :'}</p>
            <p className="font-semibold text-lumi-text text-sm">{flipped.has(i) ? card.back : card.front}</p>
            <p className="text-xs text-lumi-muted mt-2">Cliquer pour {flipped.has(i) ? 'voir la question' : 'voir la réponse'}</p>
          </button>
        ))}
      </div>
      <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
        <p className="text-sm font-bold">+ Ajouter une carte</p>
        <input value={newFront} onChange={e => setNewFront(e.target.value)} placeholder="Question..." className="w-full border-2 border-gray-200 rounded-xl p-2 text-sm focus:outline-none focus:border-lumi-blue" />
        <input value={newBack} onChange={e => setNewBack(e.target.value)} placeholder="Réponse..." className="w-full border-2 border-gray-200 rounded-xl p-2 text-sm focus:outline-none focus:border-lumi-blue" />
        <button
          onClick={() => { if (newFront && newBack) { setCards(c => [...c, { front: newFront, back: newBack }]); setNewFront(''); setNewBack('') } }}
          className="px-4 py-2 bg-lumi-blue text-white rounded-xl text-sm font-bold"
        >+ Ajouter</button>
      </div>
      <Button onClick={() => setSubmitted(true)} className="w-full">✅ Mes flashcards sont prêtes !</Button>
    </div>
  )
}
