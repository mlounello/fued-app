begin;

create extension if not exists pgcrypto;

do $$
begin
  if not exists (
    select 1 from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'game_status'
      and n.nspname = 'app_public'
  ) then
    create type app_public.game_status as enum (
      'draft',
      'live',
      'archived'
    );
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'session_status'
      and n.nspname = 'app_public'
  ) then
    create type app_public.session_status as enum (
      'inactive',
      'live',
      'paused',
      'ended'
    );
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'screen_mode'
      and n.nspname = 'app_public'
  ) then
    create type app_public.screen_mode as enum (
      'pregame',
      'board',
      'question_overlay',
      'postgame'
    );
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'asset_type'
      and n.nspname = 'app_public'
  ) then
    create type app_public.asset_type as enum (
      'logo',
      'pregame_image',
      'postgame_image'
    );
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'scoring_target'
      and n.nspname = 'app_public'
  ) then
    create type app_public.scoring_target as enum (
      'team_1',
      'team_2',
      'none'
    );
  end if;
end
$$;

commit;
