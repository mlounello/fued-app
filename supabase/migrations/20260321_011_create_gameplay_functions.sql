begin;

create or replace function app_public.launch_or_resume_session(p_game_id uuid)
returns table (
  session_id uuid,
  public_token text,
  session_status app_public.session_status,
  current_board_id uuid,
  current_screen app_public.screen_mode,
  strikes_count integer,
  sound_enabled boolean,
  score_1 integer,
  score_2 integer
)
language plpgsql
security definer
set search_path = public, app_public, app_private
as $$
declare
  v_user_id uuid;
  v_existing_session_id uuid;
  v_session_id uuid;
  v_first_board_id uuid;
begin
  v_user_id := auth.uid();

  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  if app_private.is_disabled() then
    raise exception 'User is disabled';
  end if;

  if not app_private.owns_game(p_game_id) and not app_private.is_admin() then
    raise exception 'Not authorized for game';
  end if;

  select s.id
  into v_existing_session_id
  from app_public.game_sessions s
  where s.game_id = p_game_id
    and s.owner_user_id = v_user_id
    and s.session_status = 'live'
  order by s.created_at desc
  limit 1;

  if v_existing_session_id is not null then
    return query
    select
      s.id,
      s.public_token,
      s.session_status,
      st.current_board_id,
      st.current_screen,
      st.strikes_count,
      st.sound_enabled,
      st.score_1,
      st.score_2
    from app_public.game_sessions s
    join app_public.session_state st on st.session_id = s.id
    where s.id = v_existing_session_id;
    return;
  end if;

  update app_public.game_sessions
  set
    session_status = 'ended',
    ended_at = now(),
    updated_at = now(),
    last_activity_at = now()
  where owner_user_id = v_user_id
    and session_status = 'live';

  select b.id
  into v_first_board_id
  from app_public.game_boards b
  where b.game_id = p_game_id
    and b.deleted_at is null
  order by b.sort_order asc, b.created_at asc
  limit 1;

  insert into app_public.game_sessions (
    game_id,
    owner_user_id,
    session_status,
    started_at,
    last_activity_at
  )
  values (
    p_game_id,
    v_user_id,
    'live',
    now(),
    now()
  )
  returning id into v_session_id;

  insert into app_public.session_state (
    session_id,
    current_board_id,
    current_screen,
    strikes_count,
    sound_enabled,
    score_1,
    score_2,
    updated_by_user_id
  )
  values (
    v_session_id,
    v_first_board_id,
    'pregame',
    0,
    true,
    0,
    0,
    v_user_id
  );

  insert into app_public.session_board_answers (
    session_id,
    board_id,
    answer_id,
    is_revealed
  )
  select
    v_session_id,
    b.id,
    a.id,
    false
  from app_public.game_boards b
  join app_public.board_answers a on a.board_id = b.id
  where b.game_id = p_game_id
    and b.deleted_at is null
    and a.deleted_at is null;

  return query
  select
    s.id,
    s.public_token,
    s.session_status,
    st.current_board_id,
    st.current_screen,
    st.strikes_count,
    st.sound_enabled,
    st.score_1,
    st.score_2
  from app_public.game_sessions s
  join app_public.session_state st on st.session_id = s.id
  where s.id = v_session_id;
end;
$$;

create or replace function app_public.change_session_board(
  p_session_id uuid,
  p_board_id uuid
)
returns table (
  session_id uuid,
  current_board_id uuid,
  current_screen app_public.screen_mode,
  strikes_count integer,
  score_1 integer,
  score_2 integer
)
language plpgsql
security definer
set search_path = public, app_public, app_private
as $$
declare
  v_game_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  if not app_private.is_admin_or_owner_session(p_session_id) then
    raise exception 'Not authorized for session';
  end if;

  select s.game_id
  into v_game_id
  from app_public.game_sessions s
  where s.id = p_session_id;

  if v_game_id is null then
    raise exception 'Session not found';
  end if;

  if not exists (
    select 1
    from app_public.game_boards b
    where b.id = p_board_id
      and b.game_id = v_game_id
      and b.deleted_at is null
  ) then
    raise exception 'Board not found in session game';
  end if;

  update app_public.session_state
  set
    current_board_id = p_board_id,
    current_screen = 'board',
    strikes_count = 0,
    updated_by_user_id = auth.uid(),
    updated_at = now()
  where session_id = p_session_id;

  update app_public.game_sessions
  set
    last_activity_at = now(),
    updated_at = now()
  where id = p_session_id;

  return query
  select
    st.session_id,
    st.current_board_id,
    st.current_screen,
    st.strikes_count,
    st.score_1,
    st.score_2
  from app_public.session_state st
  where st.session_id = p_session_id;
end;
$$;

create or replace function app_public.set_session_screen(
  p_session_id uuid,
  p_screen app_public.screen_mode
)
returns table (
  session_id uuid,
  current_board_id uuid,
  current_screen app_public.screen_mode,
  strikes_count integer,
  sound_enabled boolean,
  score_1 integer,
  score_2 integer
)
language plpgsql
security definer
set search_path = public, app_public, app_private
as $$
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  if not app_private.is_admin_or_owner_session(p_session_id) then
    raise exception 'Not authorized for session';
  end if;

  update app_public.session_state
  set
    current_screen = p_screen,
    updated_by_user_id = auth.uid(),
    updated_at = now()
  where session_id = p_session_id;

  update app_public.game_sessions
  set
    last_activity_at = now(),
    updated_at = now()
  where id = p_session_id;

  return query
  select
    st.session_id,
    st.current_board_id,
    st.current_screen,
    st.strikes_count,
    st.sound_enabled,
    st.score_1,
    st.score_2
  from app_public.session_state st
  where st.session_id = p_session_id;
end;
$$;

create or replace function app_public.reveal_answer(
  p_session_id uuid,
  p_answer_id uuid,
  p_scoring_target app_public.scoring_target
)
returns table (
  session_id uuid,
  answer_id uuid,
  is_revealed boolean,
  revealed_for_team app_public.scoring_target,
  score_1 integer,
  score_2 integer
)
language plpgsql
security definer
set search_path = public, app_public, app_private
as $$
declare
  v_point_value integer;
  v_already_revealed boolean;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  if not app_private.is_admin_or_owner_session(p_session_id) then
    raise exception 'Not authorized for session';
  end if;

  select a.point_value, sba.is_revealed
  into v_point_value, v_already_revealed
  from app_public.session_board_answers sba
  join app_public.board_answers a on a.id = sba.answer_id
  where sba.session_id = p_session_id
    and sba.answer_id = p_answer_id;

  if v_point_value is null then
    raise exception 'Answer not found in session';
  end if;

  if v_already_revealed then
    return query
    select
      sba.session_id,
      sba.answer_id,
      sba.is_revealed,
      sba.revealed_for_team,
      st.score_1,
      st.score_2
    from app_public.session_board_answers sba
    join app_public.session_state st on st.session_id = sba.session_id
    where sba.session_id = p_session_id
      and sba.answer_id = p_answer_id;
    return;
  end if;

  update app_public.session_board_answers
  set
    is_revealed = true,
    revealed_at = now(),
    revealed_by_user_id = auth.uid(),
    revealed_for_team = p_scoring_target,
    updated_at = now()
  where session_id = p_session_id
    and answer_id = p_answer_id;

  if p_scoring_target = 'team_1' then
    update app_public.session_state
    set
      score_1 = score_1 + v_point_value,
      updated_by_user_id = auth.uid(),
      updated_at = now()
    where session_id = p_session_id;
  elsif p_scoring_target = 'team_2' then
    update app_public.session_state
    set
      score_2 = score_2 + v_point_value,
      updated_by_user_id = auth.uid(),
      updated_at = now()
    where session_id = p_session_id;
  else
    update app_public.session_state
    set
      updated_by_user_id = auth.uid(),
      updated_at = now()
    where session_id = p_session_id;
  end if;

  update app_public.game_sessions
  set
    last_activity_at = now(),
    updated_at = now()
  where id = p_session_id;

  return query
  select
    sba.session_id,
    sba.answer_id,
    sba.is_revealed,
    sba.revealed_for_team,
    st.score_1,
    st.score_2
  from app_public.session_board_answers sba
  join app_public.session_state st on st.session_id = sba.session_id
  where sba.session_id = p_session_id
    and sba.answer_id = p_answer_id;
end;
$$;

create or replace function app_public.set_score(
  p_session_id uuid,
  p_team integer,
  p_score integer
)
returns table (
  session_id uuid,
  score_1 integer,
  score_2 integer
)
language plpgsql
security definer
set search_path = public, app_public, app_private
as $$
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  if not app_private.is_admin_or_owner_session(p_session_id) then
    raise exception 'Not authorized for session';
  end if;

  if p_score < 0 then
    raise exception 'Score cannot be negative';
  end if;

  if p_team = 1 then
    update app_public.session_state
    set
      score_1 = p_score,
      updated_by_user_id = auth.uid(),
      updated_at = now()
    where session_id = p_session_id;
  elsif p_team = 2 then
    update app_public.session_state
    set
      score_2 = p_score,
      updated_by_user_id = auth.uid(),
      updated_at = now()
    where session_id = p_session_id;
  else
    raise exception 'Team must be 1 or 2';
  end if;

  update app_public.game_sessions
  set
    last_activity_at = now(),
    updated_at = now()
  where id = p_session_id;

  return query
  select
    st.session_id,
    st.score_1,
    st.score_2
  from app_public.session_state st
  where st.session_id = p_session_id;
end;
$$;

create or replace function app_public.add_strike(
  p_session_id uuid
)
returns table (
  session_id uuid,
  strikes_count integer
)
language plpgsql
security definer
set search_path = public, app_public, app_private
as $$
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  if not app_private.is_admin_or_owner_session(p_session_id) then
    raise exception 'Not authorized for session';
  end if;

  update app_public.session_state
  set
    strikes_count = least(strikes_count + 1, 3),
    updated_by_user_id = auth.uid(),
    updated_at = now()
  where session_id = p_session_id;

  update app_public.game_sessions
  set
    last_activity_at = now(),
    updated_at = now()
  where id = p_session_id;

  return query
  select
    st.session_id,
    st.strikes_count
  from app_public.session_state st
  where st.session_id = p_session_id;
end;
$$;

create or replace function app_public.remove_strike(
  p_session_id uuid
)
returns table (
  session_id uuid,
  strikes_count integer
)
language plpgsql
security definer
set search_path = public, app_public, app_private
as $$
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  if not app_private.is_admin_or_owner_session(p_session_id) then
    raise exception 'Not authorized for session';
  end if;

  update app_public.session_state
  set
    strikes_count = greatest(strikes_count - 1, 0),
    updated_by_user_id = auth.uid(),
    updated_at = now()
  where session_id = p_session_id;

  update app_public.game_sessions
  set
    last_activity_at = now(),
    updated_at = now()
  where id = p_session_id;

  return query
  select
    st.session_id,
    st.strikes_count
  from app_public.session_state st
  where st.session_id = p_session_id;
end;
$$;

create or replace function app_public.toggle_sound(
  p_session_id uuid,
  p_enabled boolean
)
returns table (
  session_id uuid,
  sound_enabled boolean
)
language plpgsql
security definer
set search_path = public, app_public, app_private
as $$
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  if not app_private.is_admin_or_owner_session(p_session_id) then
    raise exception 'Not authorized for session';
  end if;

  update app_public.session_state
  set
    sound_enabled = p_enabled,
    updated_by_user_id = auth.uid(),
    updated_at = now()
  where session_id = p_session_id;

  update app_public.game_sessions
  set
    last_activity_at = now(),
    updated_at = now()
  where id = p_session_id;

  return query
  select
    st.session_id,
    st.sound_enabled
  from app_public.session_state st
  where st.session_id = p_session_id;
end;
$$;

create or replace function app_public.end_session(
  p_session_id uuid
)
returns table (
  session_id uuid,
  session_status app_public.session_status,
  ended_at timestamptz
)
language plpgsql
security definer
set search_path = public, app_public, app_private
as $$
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  if not app_private.is_admin_or_owner_session(p_session_id) then
    raise exception 'Not authorized for session';
  end if;

  update app_public.game_sessions
  set
    session_status = 'ended',
    ended_at = now(),
    last_activity_at = now(),
    updated_at = now()
  where id = p_session_id;

  return query
  select
    s.id,
    s.session_status,
    s.ended_at
  from app_public.game_sessions s
  where s.id = p_session_id;
end;
$$;

commit;
