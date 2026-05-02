export type UserRole = 'student' | 'parent' | 'teacher' | 'admin'

export interface Profile {
  id: string
  role: UserRole
  first_name: string
  last_name: string
  avatar_url: string | null
  dyslexia_mode: boolean
  created_at: string
}

export interface Student {
  id: string
  profile_id: string
  birth_date: string | null
  attention_profile: 'tdah' | 'dys' | 'dyscalculie' | 'mixte' | 'autre' | null
  reading_difficulty_level: 'faible' | 'moyen' | 'eleve' | null
  math_difficulty_level: 'faible' | 'moyen' | 'eleve' | null
  current_session_id: string | null
  xp: number
  level: number
  created_at: string
  profile?: Profile
}

export interface Session {
  id: string
  session_number: number
  title: string
  block_name: string
  objective: string
  description: string
  order_index: number
  is_assessment: boolean
  is_final_project: boolean
  estimated_duration_minutes: number
  created_at: string
  activities?: Activity[]
}

export type ActivityType =
  | 'intro'
  | 'quiz'
  | 'typing'
  | 'drag_and_drop'
  | 'order'
  | 'flashcard'
  | 'reflection'
  | 'editor'
  | 'todo'
  | 'comparison'
  | 'search'
  | 'emotion'
  | 'card'
  | 'map'
  | 'project_step'

export interface Activity {
  id: string
  session_id: string
  title: string
  type: ActivityType
  duration_minutes: number
  instructions: string
  content: Record<string, unknown>
  order_index: number
  xp_reward: number
  created_at: string
}

export type ProgressStatus = 'not_started' | 'in_progress' | 'completed'

export interface StudentActivityProgress {
  id: string
  student_id: string
  activity_id: string
  status: ProgressStatus
  score: number | null
  attempts: number
  time_spent_seconds: number
  completed_at: string | null
  created_at: string
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  condition_type: string
  condition_value: number
  created_at: string
}

export interface StudentBadge {
  id: string
  student_id: string
  badge_id: string
  unlocked_at: string
  badge?: Badge
}

export interface TeacherNote {
  id: string
  teacher_id: string
  student_id: string
  session_id: string | null
  note: string
  concentration_level: number | null
  typing_speed: number | null
  logic_score: number | null
  success_rate: number | null
  created_at: string
}

export interface Assessment {
  id: string
  student_id: string
  session_id: string | null
  teacher_id: string | null
  summary: string
  strengths: string
  difficulties: string
  recommendations: string
  next_adjustments: string
  created_at: string
}

export interface KeyboardResult {
  id: string
  student_id: string
  session_id: string | null
  text_reference: string
  typed_text: string
  accuracy: number | null
  speed_wpm: number | null
  errors_count: number
  created_at: string
}

export interface HomeworkHelperProject {
  id: string
  student_id: string
  name: string
  description: string
  needs: string[]
  features: string[]
  mockup: Record<string, unknown>
  presentation: Record<string, unknown>
  status: 'draft' | 'in_progress' | 'completed'
  created_at: string
}

export interface StudentCreation {
  id: string
  student_id: string
  title: string
  type: 'fiche' | 'presentation' | 'mindmap' | 'flashcards' | 'autre'
  content: Record<string, unknown>
  created_at: string
}

// Level definitions
export const LEVELS = [
  { level: 1, name: 'Débutant numérique', minXp: 0, maxXp: 100 },
  { level: 2, name: 'Explorateur', minXp: 100, maxXp: 300 },
  { level: 3, name: 'Organisateur', minXp: 300, maxXp: 600 },
  { level: 4, name: 'Détective de l\'IA', minXp: 600, maxXp: 1000 },
  { level: 5, name: 'Créateur autonome', minXp: 1000, maxXp: 9999 },
] as const

export function getLevelForXp(xp: number) {
  const level = LEVELS.slice().reverse().find(l => xp >= l.minXp)
  return level ?? LEVELS[0]
}

export function getXpProgress(xp: number) {
  const current = getLevelForXp(xp)
  const range = current.maxXp - current.minXp
  const progress = xp - current.minXp
  return Math.min(Math.round((progress / range) * 100), 100)
}
