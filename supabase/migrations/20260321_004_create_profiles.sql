begin;

create table if not exists fued_public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text null,
  is_admin boolean not null default false,
  is_disabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_login_at timestamptz null,
  constraint profiles_email_not_blank check (btrim(email) <> '')
);

create index if not exists idx_profiles_is_admin
  on fued_public.profiles (is_admin);

create index if not exists idx_profiles_is_disabled
  on fued_public.profiles (is_disabled);

drop trigger if exists trg_profiles_set_updated_at on fued_public.profiles;
create trigger trg_profiles_set_updated_at
before update on fued_public.profiles
for each row
execute function fued_private.set_updated_at();

commit;
