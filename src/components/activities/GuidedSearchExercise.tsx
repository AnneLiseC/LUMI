'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { FeedbackMessage } from '@/components/ui/FeedbackMessage'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MousePointer, FileText, PenLine } from 'lucide-react'

interface SearchResult {
  title: string
  description: string
}

interface ExtractQuestion {
  label: string
  accepted: string[]
}

interface GuidedSearchContent {
  mission: string
  keyword_question: string
  required_keywords: string[]
  keyword_hint: string
  results: SearchResult[]
  correct_result: number
  result_feedback_correct: string
  result_feedback_wrong: string
  extract_questions: ExtractQuestion[]
  sentence_required_words: string[]
  sentence_prompt: string
  completion_message: string
}

interface GuidedSearchExerciseProps {
  content: GuidedSearchContent
  xpReward: number
  onComplete: (score: number) => void
}

function containsWords(text: string, words: string[]): boolean {
  const normalized = text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  return words.every(w => normalized.includes(w.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')))
}

const SCREENS = ['mission', 'keywords', 'results', 'extract', 'sentence', 'done'] as const
type Screen = typeof SCREENS[number]

export function GuidedSearchExercise({ content, xpReward, onComplete }: GuidedSearchExerciseProps) {
  const [screen, setScreen] = useState<Screen>('mission')
  const [keywordInput, setKeywordInput] = useState('')
  const [keywordError, setKeywordError] = useState('')
  const [selectedResult, setSelectedResult] = useState<number | null>(null)
  const [resultFeedback, setResultFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [extractAnswers, setExtractAnswers] = useState<string[]>(content.extract_questions.map(() => ''))
  const [extractErrors, setExtractErrors] = useState<boolean[]>(content.extract_questions.map(() => false))
  const [sentenceInput, setSentenceInput] = useState('')
  const [sentenceError, setSentenceError] = useState('')
  const [score, setScore] = useState(100)

  const advance = () => {
    const idx = SCREENS.indexOf(screen)
    if (idx < SCREENS.length - 1) setScreen(SCREENS[idx + 1])
  }

  const handleKeywordSubmit = () => {
    if (containsWords(keywordInput, content.required_keywords)) {
      setKeywordError('')
      advance()
    } else {
      setKeywordError(content.keyword_hint)
      setScore(s => Math.max(s - 10, 50))
    }
  }

  const handleResultSelect = (i: number) => {
    setSelectedResult(i)
    if (i === content.correct_result) {
      setResultFeedback('correct')
    } else {
      setResultFeedback('wrong')
      setScore(s => Math.max(s - 20, 50))
    }
  }

  const handleExtractSubmit = () => {
    const errors = content.extract_questions.map((q, i) =>
      !q.accepted.some(a => extractAnswers[i].toLowerCase().includes(a.toLowerCase()))
    )
    setExtractErrors(errors)
    if (errors.some(Boolean)) {
      setScore(s => Math.max(s - 10, 50))
    } else {
      advance()
    }
  }

  const handleSentenceSubmit = () => {
    if (containsWords(sentenceInput, content.sentence_required_words)) {
      setSentenceError('')
      advance()
      onComplete(score)
    } else {
      setSentenceError('Ta phrase doit mentionner : la ville, le jour, la température et le temps prévu.')
      setScore(s => Math.max(s - 10, 50))
    }
  }

  const screenVariants = {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  }

  return (
    <div className="space-y-5">
      <AnimatePresence mode="wait">
        {/* SCREEN 1 — Mission */}
        {screen === 'mission' && (
          <motion.div key="mission" variants={screenVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}
            className="space-y-5"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-lumi-blue-light flex items-center justify-center flex-shrink-0">
                <Search className="w-5 h-5 text-lumi-blue" />
              </div>
              <p className="text-xs font-bold text-lumi-muted uppercase tracking-wide">Mission</p>
            </div>
            <div className="bg-gradient-to-r from-lumi-blue-light to-lumi-purple-light rounded-2xl p-5">
              <p className="text-lg font-bold text-lumi-text">{content.mission}</p>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center text-xs text-lumi-muted">
              {[
                { icon: PenLine, label: 'Mots-clés' },
                { icon: Search, label: 'Résultats' },
                { icon: MousePointer, label: 'Sélectionner' },
                { icon: FileText, label: 'Rédiger' },
              ].map((s, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center">
                    <s.icon className="w-4 h-4" />
                  </div>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
            <Button onClick={advance} className="w-full" size="lg">
              Je commence 🚀
            </Button>
          </motion.div>
        )}

        {/* SCREEN 2 — Keywords */}
        {screen === 'keywords' && (
          <motion.div key="keywords" variants={screenVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 text-xs text-lumi-muted font-bold uppercase tracking-wide">
              <PenLine className="w-4 h-4" />
              Étape 1 / 4 — Mots-clés
            </div>
            <p className="font-bold text-lumi-text text-base">{content.keyword_question}</p>
            <textarea
              value={keywordInput}
              onChange={e => { setKeywordInput(e.target.value); setKeywordError('') }}
              rows={3}
              placeholder="Tape tes mots-clés ici…"
              className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-base focus:outline-none focus:border-lumi-blue transition-colors resize-none"
            />
            {keywordError && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-sm text-yellow-800 font-semibold">
                💡 {keywordError}
              </div>
            )}
            <Button onClick={handleKeywordSubmit} className="w-full" size="lg" disabled={!keywordInput.trim()}>
              Valider mes mots-clés →
            </Button>
          </motion.div>
        )}

        {/* SCREEN 3 — Results */}
        {screen === 'results' && (
          <motion.div key="results" variants={screenVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 text-xs text-lumi-muted font-bold uppercase tracking-wide">
              <MousePointer className="w-4 h-4" />
              Étape 2 / 4 — Choisir le bon résultat
            </div>
            <p className="font-bold text-lumi-text">Quel résultat répond le plus précisément à la mission ?</p>
            <div className="space-y-2">
              {content.results.map((r, i) => (
                <button
                  key={i}
                  onClick={() => handleResultSelect(i)}
                  disabled={resultFeedback === 'correct'}
                  className={cn(
                    'w-full text-left p-4 rounded-2xl border-2 transition-all',
                    selectedResult === i && resultFeedback === 'correct'
                      ? 'border-lumi-green bg-lumi-green-light'
                      : selectedResult === i && resultFeedback === 'wrong'
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-200 bg-white hover:border-lumi-blue hover:bg-lumi-blue-light'
                  )}
                >
                  <p className="font-bold text-sm text-lumi-blue">{r.title}</p>
                  <p className="text-xs text-lumi-muted mt-1">{r.description}</p>
                </button>
              ))}
            </div>
            {resultFeedback === 'correct' && (
              <div className="bg-lumi-green-light border border-lumi-green rounded-xl p-3 text-sm text-green-800 font-semibold">
                ✅ {content.result_feedback_correct}
              </div>
            )}
            {resultFeedback === 'wrong' && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700 font-semibold">
                ❌ {content.result_feedback_wrong}
              </div>
            )}
            {resultFeedback === 'correct' && (
              <Button onClick={advance} className="w-full" size="lg">
                Continuer →
              </Button>
            )}
          </motion.div>
        )}

        {/* SCREEN 4 — Extract information */}
        {screen === 'extract' && (
          <motion.div key="extract" variants={screenVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 text-xs text-lumi-muted font-bold uppercase tracking-wide">
              <Search className="w-4 h-4" />
              Étape 3 / 4 — Extraire les informations
            </div>
            <div className="bg-lumi-blue-light rounded-2xl p-4 text-sm">
              <p className="font-bold text-lumi-blue mb-1">Résultat sélectionné :</p>
              <p className="font-bold">{content.results[content.correct_result].title}</p>
              <p className="text-lumi-muted">{content.results[content.correct_result].description}</p>
            </div>
            <div className="space-y-4">
              {content.extract_questions.map((q, i) => (
                <div key={i} className="space-y-1.5">
                  <label className="text-sm font-bold text-lumi-text block">{q.label}</label>
                  <input
                    value={extractAnswers[i]}
                    onChange={e => {
                      const updated = [...extractAnswers]
                      updated[i] = e.target.value
                      setExtractAnswers(updated)
                      const errs = [...extractErrors]
                      errs[i] = false
                      setExtractErrors(errs)
                    }}
                    placeholder="Ta réponse…"
                    className={cn(
                      'w-full border-2 rounded-2xl px-4 py-3 text-base focus:outline-none transition-colors',
                      extractErrors[i] ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-lumi-blue'
                    )}
                  />
                  {extractErrors[i] && (
                    <p className="text-xs text-red-600 font-semibold">Relis le résultat et cherche cette information.</p>
                  )}
                </div>
              ))}
            </div>
            <Button
              onClick={handleExtractSubmit}
              className="w-full"
              size="lg"
              disabled={extractAnswers.some(a => !a.trim())}
            >
              Valider →
            </Button>
          </motion.div>
        )}

        {/* SCREEN 5 — Full sentence */}
        {screen === 'sentence' && (
          <motion.div key="sentence" variants={screenVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 text-xs text-lumi-muted font-bold uppercase tracking-wide">
              <FileText className="w-4 h-4" />
              Étape 4 / 4 — Rédiger la réponse
            </div>
            <p className="font-bold text-lumi-text">{content.sentence_prompt}</p>
            <div className="bg-lumi-purple-light rounded-xl p-3 text-xs text-lumi-muted">
              <p className="font-bold text-lumi-purple mb-1">Ta réponse doit mentionner :</p>
              <div className="flex flex-wrap gap-1.5">
                {content.sentence_required_words.map(w => (
                  <span key={w} className="px-2 py-0.5 bg-white rounded-lg font-semibold">{w}</span>
                ))}
              </div>
            </div>
            <textarea
              value={sentenceInput}
              onChange={e => { setSentenceInput(e.target.value); setSentenceError('') }}
              rows={4}
              placeholder="Écris ta phrase ici…"
              className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-base focus:outline-none focus:border-lumi-blue transition-colors resize-none"
            />
            {sentenceError && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-sm text-yellow-800 font-semibold">
                💡 {sentenceError}
              </div>
            )}
            <Button
              onClick={handleSentenceSubmit}
              className="w-full"
              size="lg"
              disabled={sentenceInput.trim().length < 10}
            >
              Envoyer ma réponse ✅
            </Button>
          </motion.div>
        )}

        {/* SCREEN 6 — Done */}
        {screen === 'done' && (
          <motion.div key="done" variants={screenVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}
            className="space-y-5"
          >
            <div className="text-center">
              <div className="text-5xl mb-3">🔍</div>
              <h3 className="text-xl font-black text-lumi-text">Recherche terminée !</h3>
            </div>
            <div className="bg-lumi-blue-light rounded-2xl p-4 space-y-2 text-sm">
              <p className="font-bold text-lumi-blue">Ce que tu as appris :</p>
              <ul className="space-y-1 text-lumi-text">
                <li>✅ Formuler des mots-clés précis</li>
                <li>✅ Choisir le bon résultat parmi plusieurs</li>
                <li>✅ Extraire les informations utiles</li>
                <li>✅ Rédiger une réponse complète</li>
              </ul>
            </div>
            <FeedbackMessage
              type="success"
              message={content.completion_message}
              xpGained={xpReward}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
