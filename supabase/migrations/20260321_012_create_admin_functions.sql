begin;

create or replace function fued_public.admin_set_user_disabled(
  p_user_id uuid,
  p_disabled boolean
)
returns table (
  user_id uuid,
  is_disabled boolean
)
language plpgsql
security definer
set search_path = pg_catalog
as $$
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  if not fued_private.is_admin() then
    raise exception 'Admin only';
  end if;

  update fued_public.profiles
  set
    is_disabled = p_disabled,
    updated_at = now()
  where id = p_user_id;

  return query
  select
    p.id,
    p.is_disabled
  from fued_public.profiles p
  where p.id = p_user_id;
end;
$$;

create or replace function fued_public.admin_soft_delete_game(
  p_game_id uuid
)
returns table (
  game_id uuid,
  deleted_at timestamptz
)
language plpgsql
security definer
set search_path = pg_catalog
as $$
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  if not fued_private.is_admin() then
    raise exception 'Admin only';
  end if;

  update fued_public.games
  set
    deleted_at = now(),
    updated_at = now()
  where id = p_game_id
    and deleted_at is null;

  return query
  select
    g.id,
    g.deleted_at
  from fued_public.games g
  where g.id = p_game_id;
end;
$$;

commit;
