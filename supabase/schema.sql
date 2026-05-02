-- ============================================================
-- LUMI – Schéma complet de base de données Supabase
-- ============================================================

-- Extension UUID
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES
-- ============================================================
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('student', 'parent', 'teacher', 'admin')),
  first_name text not null default '',
  last_name text not null default '',
  avatar_url text,
  dyslexia_mode boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================
-- STUDENTS
-- ============================================================
create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  birth_date date,
  attention_profile text check (attention_profile in ('tdah', 'dys', 'dyscalculie', 'mixte', 'autre', null)),
  reading_difficulty_level text check (reading_difficulty_level in ('faible', 'moyen', 'eleve', null)),
  math_difficulty_level text check (math_difficulty_level in ('faible', 'moyen', 'eleve', null)),
  current_session_id uuid,
  xp integer not null default 0,
  level integer not null default 1,
  created_at timestamptz not null default now()
);

-- ============================================================
-- PARENT – STUDENT
-- ============================================================
create table if not exists parent_students (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references profiles(id) on delete cascade,
  student_id uuid not null references students(id) on delete cascade,
  unique (parent_id, student_id)
);

-- ============================================================
-- TEACHER – STUDENT
-- ============================================================
create table if not exists teacher_students (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references profiles(id) on delete cascade,
  student_id uuid not null references students(id) on delete cascade,
  unique (teacher_id, student_id)
);

-- ============================================================
-- SESSIONS
-- ============================================================
create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  session_number integer not null,
  title text not null,
  block_name text not null default '',
  objective text not null default '',
  description text not null default '',
  order_index integer not null,
  is_assessment boolean not null default false,
  is_final_project boolean not null default false,
  estimated_duration_minutes integer not null default 30,
  created_at timestamptz not null default now()
);

-- ============================================================
-- ACTIVITIES
-- ============================================================
create table if not exists activities (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions(id) on delete cascade,
  title text not null,
  type text not null check (type in (
    'intro', 'quiz', 'typing', 'drag_and_drop', 'order',
    'flashcard', 'reflection', 'editor', 'todo', 'comparison',
    'search', 'emotion', 'card', 'map', 'project_step'
  )),
  duration_minutes integer not null default 5,
  instructions text not null default '',
  content jsonb not null default '{}',
  order_index integer not null,
  xp_reward integer not null default 10,
  created_at timestamptz not null default now()
);

-- ============================================================
-- STUDENT ACTIVITY PROGRESS
-- ============================================================
create table if not exists student_activity_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  activity_id uuid not null references activities(id) on delete cascade,
  status text not null default 'not_started' check (status in ('not_started', 'in_progress', 'completed')),
  score integer,
  attempts integer not null default 0,
  time_spent_seconds integer not null default 0,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (student_id, activity_id)
);

-- ============================================================
-- BADGES
-- ============================================================
create table if not exists badges (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  icon text not null default '🏅',
  condition_type text not null check (condition_type in (
    'first_activity', 'sessions_completed', 'xp_reached',
    'typing_accuracy', 'assessment_done', 'project_done', 'streak'
  )),
  condition_value integer not null default 1,
  created_at timestamptz not null default now()
);

-- ============================================================
-- STUDENT BADGES
-- ============================================================
create table if not exists student_badges (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  badge_id uuid not null references badges(id) on delete cascade,
  unlocked_at timestamptz not null default now(),
  unique (student_id, badge_id)
);

-- ============================================================
-- TEACHER NOTES
-- ============================================================
create table if not exists teacher_notes (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references profiles(id) on delete cascade,
  student_id uuid not null references students(id) on delete cascade,
  session_id uuid references sessions(id) on delete set null,
  note text not null default '',
  concentration_level integer check (concentration_level between 1 and 5),
  typing_speed integer,
  logic_score integer check (logic_score between 0 and 100),
  success_rate integer check (success_rate between 0 and 100),
  created_at timestamptz not null default now()
);

-- ============================================================
-- ASSESSMENTS (Bilans)
-- ============================================================
create table if not exists assessments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  session_id uuid references sessions(id) on delete set null,
  teacher_id uuid references profiles(id) on delete set null,
  summary text not null default '',
  strengths text not null default '',
  difficulties text not null default '',
  recommendations text not null default '',
  next_adjustments text not null default '',
  created_at timestamptz not null default now()
);

-- ============================================================
-- STUDENT CREATIONS
-- ============================================================
create table if not exists student_creations (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  title text not null,
  type text not null check (type in ('fiche', 'presentation', 'mindmap', 'flashcards', 'autre')),
  content jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- ============================================================
-- AI COMPARISONS
-- ============================================================
create table if not exists ai_comparisons (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  prompt text not null,
  ai_a_response text not null default '',
  ai_b_response text not null default '',
  ai_c_response text not null default '',
  best_answer text,
  student_observation text,
  teacher_feedback text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- KEYBOARD RESULTS
-- ============================================================
create table if not exists keyboard_results (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  session_id uuid references sessions(id) on delete set null,
  text_reference text not null,
  typed_text text not null default '',
  accuracy integer check (accuracy between 0 and 100),
  speed_wpm integer,
  errors_count integer not null default 0,
  created_at timestamptz not null default now()
);

-- ============================================================
-- HOMEWORK HELPER PROJECTS
-- ============================================================
create table if not exists homework_helper_projects (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  name text not null default 'Mon assistant de devoirs',
  description text not null default '',
  needs jsonb not null default '[]',
  features jsonb not null default '[]',
  mockup jsonb not null default '{}',
  presentation jsonb not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'in_progress', 'completed')),
  created_at timestamptz not null default now()
);
