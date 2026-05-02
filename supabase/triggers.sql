-- ============================================================
-- LUMI – Triggers Supabase
-- ============================================================

-- Créer automatiquement un profil quand un utilisateur s'inscrit
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into profiles (id, role, first_name, last_name)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data->>'role', ''), 'student'),
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', '')
  )
  on conflict (id) do update
    set role = excluded.role
    where profiles.role = 'student' and excluded.role != 'student';

  -- Si c'est un élève, créer aussi l'entrée students
  if coalesce(new.raw_user_meta_data->>'role', 'student') = 'student' then
    insert into students (profile_id, xp, level)
    values (new.id, 0, 1)
    on conflict do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ============================================================
-- Attribuer les badges automatiquement
-- ============================================================
create or replace function check_and_award_badges(p_student_id uuid)
returns void
language plpgsql
security definer
as $$
declare
  v_xp integer;
  v_completed_sessions integer;
  v_badge record;
begin
  -- Get student XP
  select xp into v_xp from students where id = p_student_id;

  -- Count completed sessions (>= 80% activities done)
  select count(distinct s.id) into v_completed_sessions
  from sessions s
  where (
    select count(*) from activities a
    left join student_activity_progress sap on sap.activity_id = a.id and sap.student_id = p_student_id and sap.status = 'completed'
    where a.session_id = s.id and sap.id is not null
  ) >= (
    select count(*) * 0.6 from activities a2 where a2.session_id = s.id
  );

  -- Loop through all badges and check conditions
  for v_badge in select * from badges loop
    -- Skip if already unlocked
    continue when exists (
      select 1 from student_badges where student_id = p_student_id and badge_id = v_badge.id
    );

    -- Check condition
    if v_badge.condition_type = 'first_activity' and (
      select count(*) from student_activity_progress where student_id = p_student_id and status = 'completed'
    ) >= v_badge.condition_value then
      insert into student_badges (student_id, badge_id) values (p_student_id, v_badge.id) on conflict do nothing;
    end if;

    if v_badge.condition_type = 'xp_reached' and v_xp >= v_badge.condition_value then
      insert into student_badges (student_id, badge_id) values (p_student_id, v_badge.id) on conflict do nothing;
    end if;

    if v_badge.condition_type = 'sessions_completed' and v_completed_sessions >= v_badge.condition_value then
      insert into student_badges (student_id, badge_id) values (p_student_id, v_badge.id) on conflict do nothing;
    end if;
  end loop;
end;
$$;
