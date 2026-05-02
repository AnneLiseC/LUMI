-- ============================================================
-- LUMI – Row Level Security Policies
-- ============================================================

-- Helper: get current user role
create or replace function get_my_role()
returns text
language sql
security definer
stable
as $$
  select role from profiles where id = auth.uid()
$$;

-- Helper: is current user a student linked to student_id
create or replace function is_my_student_profile(student_profile_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from students
    where profile_id = auth.uid() and id = student_profile_id
  )
$$;

-- Helper: is current user parent of this student
create or replace function is_parent_of(student_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from parent_students
    where parent_id = auth.uid() and parent_students.student_id = $1
  )
$$;

-- Helper: is current user teacher of this student
create or replace function is_teacher_of(student_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from teacher_students
    where teacher_id = auth.uid() and teacher_students.student_id = $1
  )
$$;

-- ============================================================
-- PROFILES
-- ============================================================
alter table profiles enable row level security;

create policy "Users can view their own profile"
  on profiles for select
  using (id = auth.uid() or get_my_role() in ('admin', 'teacher', 'parent'));

create policy "Users can update their own profile"
  on profiles for update
  using (id = auth.uid());

create policy "Admins can do everything on profiles"
  on profiles for all
  using (get_my_role() = 'admin');

-- ============================================================
-- STUDENTS
-- ============================================================
alter table students enable row level security;

create policy "Students can view their own record"
  on students for select
  using (profile_id = auth.uid());

create policy "Students can update their own record"
  on students for update
  using (profile_id = auth.uid());

create policy "Parents can view their children"
  on students for select
  using (is_parent_of(id));

create policy "Teachers can view their students"
  on students for select
  using (is_teacher_of(id));

create policy "Admins have full access to students"
  on students for all
  using (get_my_role() = 'admin');

-- ============================================================
-- PARENT_STUDENTS
-- ============================================================
alter table parent_students enable row level security;

create policy "Parents can view their own links"
  on parent_students for select
  using (parent_id = auth.uid());

create policy "Admins manage parent_students"
  on parent_students for all
  using (get_my_role() = 'admin');

-- ============================================================
-- TEACHER_STUDENTS
-- ============================================================
alter table teacher_students enable row level security;

create policy "Teachers can view their own links"
  on teacher_students for select
  using (teacher_id = auth.uid());

create policy "Admins manage teacher_students"
  on teacher_students for all
  using (get_my_role() = 'admin');

-- ============================================================
-- SESSIONS
-- ============================================================
alter table sessions enable row level security;

create policy "Everyone can read sessions"
  on sessions for select
  using (auth.uid() is not null);

create policy "Admins can manage sessions"
  on sessions for all
  using (get_my_role() = 'admin');

-- ============================================================
-- ACTIVITIES
-- ============================================================
alter table activities enable row level security;

create policy "Everyone authenticated can read activities"
  on activities for select
  using (auth.uid() is not null);

create policy "Admins can manage activities"
  on activities for all
  using (get_my_role() = 'admin');

-- ============================================================
-- STUDENT ACTIVITY PROGRESS
-- ============================================================
alter table student_activity_progress enable row level security;

create policy "Students can view their own progress"
  on student_activity_progress for select
  using (exists (
    select 1 from students s
    where s.id = student_activity_progress.student_id
    and s.profile_id = auth.uid()
  ));

create policy "Students can insert their own progress"
  on student_activity_progress for insert
  with check (exists (
    select 1 from students s
    where s.id = student_activity_progress.student_id
    and s.profile_id = auth.uid()
  ));

create policy "Students can update their own progress"
  on student_activity_progress for update
  using (exists (
    select 1 from students s
    where s.id = student_activity_progress.student_id
    and s.profile_id = auth.uid()
  ));

create policy "Parents can view their children progress"
  on student_activity_progress for select
  using (is_parent_of(student_id));

create policy "Teachers can view their students progress"
  on student_activity_progress for select
  using (is_teacher_of(student_id));

create policy "Teachers can update their students progress"
  on student_activity_progress for update
  using (is_teacher_of(student_id));

create policy "Admins have full access to progress"
  on student_activity_progress for all
  using (get_my_role() = 'admin');

-- ============================================================
-- BADGES
-- ============================================================
alter table badges enable row level security;

create policy "Everyone can read badges"
  on badges for select
  using (auth.uid() is not null);

create policy "Admins can manage badges"
  on badges for all
  using (get_my_role() = 'admin');

-- ============================================================
-- STUDENT BADGES
-- ============================================================
alter table student_badges enable row level security;

create policy "Students can view their own badges"
  on student_badges for select
  using (exists (
    select 1 from students s
    where s.id = student_badges.student_id
    and s.profile_id = auth.uid()
  ));

create policy "Parents can view their children badges"
  on student_badges for select
  using (is_parent_of(student_id));

create policy "Teachers can view their students badges"
  on student_badges for select
  using (is_teacher_of(student_id));

create policy "Service role inserts badges"
  on student_badges for insert
  with check (get_my_role() in ('admin', 'student'));

create policy "Admins manage student_badges"
  on student_badges for all
  using (get_my_role() = 'admin');

-- ============================================================
-- TEACHER NOTES
-- ============================================================
alter table teacher_notes enable row level security;

create policy "Teachers can view their own notes"
  on teacher_notes for select
  using (teacher_id = auth.uid());

create policy "Teachers can create notes for their students"
  on teacher_notes for insert
  with check (teacher_id = auth.uid() and is_teacher_of(student_id));

create policy "Teachers can update their own notes"
  on teacher_notes for update
  using (teacher_id = auth.uid());

create policy "Teachers can delete their own notes"
  on teacher_notes for delete
  using (teacher_id = auth.uid());

create policy "Students can view their own notes"
  on teacher_notes for select
  using (exists (
    select 1 from students s
    where s.id = teacher_notes.student_id
    and s.profile_id = auth.uid()
  ));

create policy "Parents can view notes on their children"
  on teacher_notes for select
  using (is_parent_of(student_id));

create policy "Admins have full access to teacher_notes"
  on teacher_notes for all
  using (get_my_role() = 'admin');

-- ============================================================
-- ASSESSMENTS
-- ============================================================
alter table assessments enable row level security;

create policy "Teachers can manage assessments for their students"
  on assessments for all
  using (teacher_id = auth.uid() or is_teacher_of(student_id));

create policy "Students can view their own assessments"
  on assessments for select
  using (exists (
    select 1 from students s
    where s.id = assessments.student_id
    and s.profile_id = auth.uid()
  ));

create policy "Parents can view assessments of their children"
  on assessments for select
  using (is_parent_of(student_id));

create policy "Admins have full access to assessments"
  on assessments for all
  using (get_my_role() = 'admin');

-- ============================================================
-- STUDENT CREATIONS
-- ============================================================
alter table student_creations enable row level security;

create policy "Students can manage their own creations"
  on student_creations for all
  using (exists (
    select 1 from students s
    where s.id = student_creations.student_id
    and s.profile_id = auth.uid()
  ));

create policy "Parents can view creations"
  on student_creations for select
  using (is_parent_of(student_id));

create policy "Teachers can view creations"
  on student_creations for select
  using (is_teacher_of(student_id));

create policy "Admins have full access to creations"
  on student_creations for all
  using (get_my_role() = 'admin');

-- ============================================================
-- AI COMPARISONS
-- ============================================================
alter table ai_comparisons enable row level security;

create policy "Students manage their own comparisons"
  on ai_comparisons for all
  using (exists (
    select 1 from students s
    where s.id = ai_comparisons.student_id
    and s.profile_id = auth.uid()
  ));

create policy "Teachers can view and comment ai_comparisons"
  on ai_comparisons for select
  using (is_teacher_of(student_id));

create policy "Teachers can update feedback on ai_comparisons"
  on ai_comparisons for update
  using (is_teacher_of(student_id));

create policy "Parents can view ai_comparisons"
  on ai_comparisons for select
  using (is_parent_of(student_id));

create policy "Admins full access to ai_comparisons"
  on ai_comparisons for all
  using (get_my_role() = 'admin');

-- ============================================================
-- KEYBOARD RESULTS
-- ============================================================
alter table keyboard_results enable row level security;

create policy "Students can manage their keyboard results"
  on keyboard_results for all
  using (exists (
    select 1 from students s
    where s.id = keyboard_results.student_id
    and s.profile_id = auth.uid()
  ));

create policy "Teachers can view keyboard results"
  on keyboard_results for select
  using (is_teacher_of(student_id));

create policy "Parents can view keyboard results"
  on keyboard_results for select
  using (is_parent_of(student_id));

create policy "Admins full access to keyboard_results"
  on keyboard_results for all
  using (get_my_role() = 'admin');

-- ============================================================
-- HOMEWORK HELPER PROJECTS
-- ============================================================
alter table homework_helper_projects enable row level security;

create policy "Students manage their own projects"
  on homework_helper_projects for all
  using (exists (
    select 1 from students s
    where s.id = homework_helper_projects.student_id
    and s.profile_id = auth.uid()
  ));

create policy "Teachers can view student projects"
  on homework_helper_projects for select
  using (is_teacher_of(student_id));

create policy "Parents can view student projects"
  on homework_helper_projects for select
  using (is_parent_of(student_id));

create policy "Admins full access to projects"
  on homework_helper_projects for all
  using (get_my_role() = 'admin');
