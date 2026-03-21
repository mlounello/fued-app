begin;

create or replace function app_private.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function app_private.current_user_id()
returns uuid
language sql
stable
as $$
  select auth.uid()
$$;

create or replace function app_private.generate_public_token()
returns text
language sql
volatile
as $$
  select encode(gen_random_bytes(24), 'hex')
$$;

commit;
