begin;

create or replace function fued_private.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function fued_private.current_user_id()
returns uuid
language sql
stable
set search_path = pg_catalog
as $$
  select auth.uid()
$$;

create or replace function fued_private.generate_public_token()
returns text
language sql
volatile
set search_path = pg_catalog
as $$
  select encode(gen_random_bytes(24), 'hex')
$$;

commit;
