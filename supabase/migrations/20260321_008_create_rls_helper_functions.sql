begin;

create or replace function app_private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, app_public, app_private
as $$
  select coalesce(
    (
      select p.is_admin
      from app_public.profiles p
      where p.id = auth.uid()
    ),
    false
  )
$$;

create or replace function app_private.is_disabled()
returns boolean
language sql
stable
security definer
set search_path = public, app_public, app_private
as $$
  select coalesce(
    (
      select p.is_disabled
      from app_public.profiles p
      where p.id = auth.uid()
    ),
    false
  )
$$;

create or replace function app_private.owns_game(p_game_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, app_public, app_private
as $$
  select exists (
    select 1
    from app_public.games g
    where g.id = p_game_id
      and g.owner_user_id = auth.uid()
      and g.deleted_at is null
  )
$$;

create or replace function app_private.owns_board(p_board_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, app_public, app_private
as $$
  select exists (
    select 1
    from app_public.game_boards b
    join app_public.games g on g.id = b.game_id
    where b.id = p_board_id
      and g.owner_user_id = auth.uid()
      and g.deleted_at is null
      and b.deleted_at is null
  )
$$;

create or replace function app_private.owns_answer(p_answer_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, app_public, app_private
as $$
  select exists (
    select 1
    from app_public.board_answers a
    join app_public.game_boards b on b.id = a.board_id
    join app_public.games g on g.id = b.game_id
    where a.id = p_answer_id
      and g.owner_user_id = auth.uid()
      and g.deleted_at is null
      and b.deleted_at is null
      and a.deleted_at is null
  )
$$;

create or replace function app_private.owns_session(p_session_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, app_public, app_private
as $$
  select exists (
    select 1
    from app_public.game_sessions s
    where s.id = p_session_id
      and s.owner_user_id = auth.uid()
  )
$$;

create or replace function app_private.is_admin_or_owner_game(p_game_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, app_public, app_private
as $$
  select app_private.is_admin() or app_private.owns_game(p_game_id)
$$;

create or replace function app_private.is_admin_or_owner_board(p_board_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, app_public, app_private
as $$
  select app_private.is_admin() or app_private.owns_board(p_board_id)
$$;

create or replace function app_private.is_admin_or_owner_answer(p_answer_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, app_public, app_private
as $$
  select app_private.is_admin() or app_private.owns_answer(p_answer_id)
$$;

create or replace function app_private.is_admin_or_owner_session(p_session_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, app_public, app_private
as $$
  select app_private.is_admin() or app_private.owns_session(p_session_id)
$$;

commit;
