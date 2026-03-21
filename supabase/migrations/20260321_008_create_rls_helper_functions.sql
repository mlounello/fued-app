begin;

create or replace function fued_private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = pg_catalog
as $$
  select coalesce(
    (
      select p.is_admin
      from fued_public.profiles p
      where p.id = auth.uid()
    ),
    false
  )
$$;

create or replace function fued_private.is_disabled()
returns boolean
language sql
stable
security definer
set search_path = pg_catalog
as $$
  select coalesce(
    (
      select p.is_disabled
      from fued_public.profiles p
      where p.id = auth.uid()
    ),
    false
  )
$$;

create or replace function fued_private.owns_game(p_game_id uuid)
returns boolean
language sql
stable
security definer
set search_path = pg_catalog
as $$
  select exists (
    select 1
    from fued_public.games g
    where g.id = p_game_id
      and g.owner_user_id = auth.uid()
      and g.deleted_at is null
  )
$$;

create or replace function fued_private.owns_board(p_board_id uuid)
returns boolean
language sql
stable
security definer
set search_path = pg_catalog
as $$
  select exists (
    select 1
    from fued_public.game_boards b
    join fued_public.games g on g.id = b.game_id
    where b.id = p_board_id
      and g.owner_user_id = auth.uid()
      and g.deleted_at is null
      and b.deleted_at is null
  )
$$;

create or replace function fued_private.owns_answer(p_answer_id uuid)
returns boolean
language sql
stable
security definer
set search_path = pg_catalog
as $$
  select exists (
    select 1
    from fued_public.board_answers a
    join fued_public.game_boards b on b.id = a.board_id
    join fued_public.games g on g.id = b.game_id
    where a.id = p_answer_id
      and g.owner_user_id = auth.uid()
      and g.deleted_at is null
      and b.deleted_at is null
      and a.deleted_at is null
  )
$$;

create or replace function fued_private.owns_session(p_session_id uuid)
returns boolean
language sql
stable
security definer
set search_path = pg_catalog
as $$
  select exists (
    select 1
    from fued_public.game_sessions s
    where s.id = p_session_id
      and s.owner_user_id = auth.uid()
  )
$$;

create or replace function fued_private.is_admin_or_owner_game(p_game_id uuid)
returns boolean
language sql
stable
security definer
set search_path = pg_catalog
as $$
  select fued_private.is_admin() or fued_private.owns_game(p_game_id)
$$;

create or replace function fued_private.is_admin_or_owner_board(p_board_id uuid)
returns boolean
language sql
stable
security definer
set search_path = pg_catalog
as $$
  select fued_private.is_admin() or fued_private.owns_board(p_board_id)
$$;

create or replace function fued_private.is_admin_or_owner_answer(p_answer_id uuid)
returns boolean
language sql
stable
security definer
set search_path = pg_catalog
as $$
  select fued_private.is_admin() or fued_private.owns_answer(p_answer_id)
$$;

create or replace function fued_private.is_admin_or_owner_session(p_session_id uuid)
returns boolean
language sql
stable
security definer
set search_path = pg_catalog
as $$
  select fued_private.is_admin() or fued_private.owns_session(p_session_id)
$$;

commit;
