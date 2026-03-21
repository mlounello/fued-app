begin;

create table if not exists fued_public.game_assets (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references fued_public.profiles(id) on delete restrict,
  game_id uuid null references fued_public.games(id) on delete cascade,
  asset_type fued_public.asset_type not null,
  storage_bucket text not null,
  storage_path text not null,
  mime_type text not null,
  file_size_bytes bigint not null,
  original_filename text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz null,
  constraint game_assets_bucket_not_blank check (btrim(storage_bucket) <> ''),
  constraint game_assets_path_not_blank check (btrim(storage_path) <> ''),
  constraint game_assets_mime_not_blank check (btrim(mime_type) <> ''),
  constraint game_assets_file_size_positive check (file_size_bytes > 0)
);

create index if not exists idx_game_assets_owner_user_id
  on fued_public.game_assets (owner_user_id);

create index if not exists idx_game_assets_game_id
  on fued_public.game_assets (game_id);

create index if not exists idx_game_assets_deleted_at
  on fued_public.game_assets (deleted_at);

drop trigger if exists trg_game_assets_set_updated_at on fued_public.game_assets;
create trigger trg_game_assets_set_updated_at
before update on fued_public.game_assets
for each row
execute function fued_private.set_updated_at();

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'games_logo_asset_fk') then
    alter table fued_public.games
      add constraint games_logo_asset_fk
      foreign key (logo_asset_id) references fued_public.game_assets(id) on delete set null;
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'games_pregame_asset_fk') then
    alter table fued_public.games
      add constraint games_pregame_asset_fk
      foreign key (pregame_asset_id) references fued_public.game_assets(id) on delete set null;
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'games_postgame_asset_fk') then
    alter table fued_public.games
      add constraint games_postgame_asset_fk
      foreign key (postgame_asset_id) references fued_public.game_assets(id) on delete set null;
  end if;
end
$$;

commit;
