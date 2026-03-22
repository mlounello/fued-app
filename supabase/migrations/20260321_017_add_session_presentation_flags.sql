begin;

alter table if exists fued_public.session_state
  add column if not exists show_game_title boolean not null default true,
  add column if not exists show_strikes_bar boolean not null default true;

commit;
