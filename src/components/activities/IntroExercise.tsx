'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface IntroContent {
  message?: string
  avatars?: string[]
  xp_explanation?: string
}

interface IntroExerciseProps {
  content: IntroContent
  xpReward: number
  onComplete: (score: number) => void
}

export function IntroExercise({ content, xpReward, onComplete }: IntroExerciseProps) {
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null)

  return (
    <div className="space-y-6 text-center">
      <div className="text-6xl animate-float">⭐</div>

      {content.message && (
        <div className="bg-lumi-blue-light rounded-3xl p-6">
          <p className="text-lg font-semibold text-lumi-text leading-relaxed">{content.message}</p>
        </div>
      )}

      {content.avatars && (
        <div>
          <p className="font-bold text-lumi-text mb-4">Choisis ton avatar !</p>
          <div className="grid grid-cols-4 gap-3">
            {content.avatars.map(avatar => (
              <button
                key={avatar}
                onClick={() => setSelectedAvatar(avatar)}
                className={cn(
                  'w-full aspect-square rounded-2xl text-4xl flex items-center justify-center transition-all border-2',
                  selectedAvatar === avatar
                    ? 'border-lumi-blue bg-lumi-blue-light scale-110 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-lumi-blue hover:bg-lumi-blue-light hover:scale-105'
                )}
              >
                {avatar}
              </button>
            ))}
          </div>
        </div>
      )}

      {content.xp_explanation && (
        <div className="bg-lumi-yellow-light rounded-2xl p-4 border-2 border-lumi-yellow text-left">
          <p className="text-sm font-semibold text-lumi-text">⚡ {content.xp_explanation}</p>
        </div>
      )}

      <Button
        onClick={() => onComplete(100)}
        disabled={!!(content.avatars && !selectedAvatar)}
        className="w-full"
        size="lg"
      >
        {selectedAvatar ? `Allons-y avec ${selectedAvatar} !` : 'Commencer !'}
      </Button>
    </div>
  )
}
