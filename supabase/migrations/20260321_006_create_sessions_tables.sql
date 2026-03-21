begin;

create table if not exists app_public.game_sessions (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references app_public.games(id) on delete cascade,
  owner_user_id uuid not null references app_public.profiles(id) on delete restrict,
  session_status app_public.session_status not null default 'inactive',
  public_token text not null unique default app_private.generate_public_token(),
  started_at timestamptz null,
  ended_at timestamptz null,
  last_activity_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists app_public.session_state (
  session_id uuid primary key references app_public.game_sessions(id) on delete cascade,
  current_board_id uuid null references app_public.game_boards(id) on delete set null,
  current_screen app_public.screen_mode not null default 'pregame',
  strikes_count integer not null default 0,
  sound_enabled boolean not null default true,
  score_1 integer not null default 0,
  score_2 integer not null default 0,
  updated_at timestamptz not null default now(),
  updated_by_user_id uuid null references app_public.profiles(id) on delete set null,
  constraint session_state_strikes_range check (strikes_count between 0 and 3),
  constraint session_state_score_1_nonnegative check (score_1 >= 0),
  constraint session_state_score_2_nonnegative check (score_2 >= 0)
);

create table if not exists app_public.session_board_answers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references app_public.game_sessions(id) on delete cascade,
  board_id uuid not null references app_public.game_boards(id) on delete cascade,
  answer_id uuid not null references app_public.board_answers(id) on delete cascade,
  is_revealed boolean not null default false,
  revealed_at timestamptz null,
  revealed_by_user_id uuid null references app_public.profiles(id) on delete set null,
  revealed_for_team app_public.scoring_target null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint session_board_answers_unique_session_answer unique (session_id, answer_id)
);

create index if not exists idx_game_sessions_game_id
  on app_public.game_sessions (game_id);

create index if not exists idx_game_sessions_owner_user_id
  on app_public.game_sessions (owner_user_id);

create index if not exists idx_game_sessions_status
  on app_public.game_sessions (session_status);

create unique index if not exists uq_game_sessions_one_live_per_owner
  on app_public.game_sessions (owner_user_id)
  where session_status = 'live';

create index if not exists idx_session_board_answers_session_id
  on app_public.session_board_answers (session_id);

create index if not exists idx_session_board_answers_session_board
  on app_public.session_board_answers (session_id, board_id);

create index if not exists idx_session_board_answers_session_revealed
  on app_public.session_board_answers (session_id, is_revealed);

drop trigger if exists trg_game_sessions_set_updated_at on app_public.game_sessions;
create trigger trg_game_sessions_set_updated_at
before update on app_public.game_sessions
for each row
execute function app_private.set_updated_at();

drop trigger if exists trg_session_state_set_updated_at on app_public.session_state;
create trigger trg_session_state_set_updated_at
before update on app_public.session_state
for each row
execute function app_private.set_updated_at();

drop trigger if exists trg_session_board_answers_set_updated_at on app_public.session_board_answers;
create trigger trg_session_board_answers_set_updated_at
before update on app_public.session_board_answers
for each row
execute function app_private.set_updated_at();

commit;
