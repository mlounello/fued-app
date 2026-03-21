begin;

create table if not exists app_public.games (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references app_public.profiles(id) on delete restrict,
  title text not null default 'Untitled Game',
  status app_public.game_status not null default 'draft',
  show_team_names boolean not null default true,
  show_scores boolean not null default true,
  team_1_name text not null default 'Team 1',
  team_2_name text not null default 'Team 2',
  heading_font text not null default 'Oswald',
  subhead_font text not null default 'Gudea',
  body_font text not null default 'Merriweather',
  brand_primary_color text not null default '#f7c948',
  brand_secondary_color text not null default '#0f172a',
  brand_accent_color text null default '#ffffff',
  brand_background_color text null default '#111827',
  logo_asset_id uuid null,
  pregame_asset_id uuid null,
  postgame_asset_id uuid null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz null,
  constraint games_title_not_blank check (btrim(title) <> ''),
  constraint games_team_1_name_not_blank check (btrim(team_1_name) <> ''),
  constraint games_team_2_name_not_blank check (btrim(team_2_name) <> ''),
  constraint games_heading_font_allowed check (heading_font in ('Oswald')),
  constraint games_subhead_font_allowed check (subhead_font in ('Gudea')),
  constraint games_body_font_allowed check (body_font in ('Merriweather'))
);

create table if not exists app_public.game_boards (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references app_public.games(id) on delete cascade,
  question_text text not null,
  sort_order integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz null,
  constraint game_boards_question_not_blank check (btrim(question_text) <> ''),
  constraint game_boards_sort_order_positive check (sort_order > 0)
);

create table if not exists app_public.board_answers (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references app_public.game_boards(id) on delete cascade,
  answer_text text not null,
  point_value integer not null,
  display_position integer not null,
  sort_order integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz null,
  constraint board_answers_text_not_blank check (btrim(answer_text) <> ''),
  constraint board_answers_point_value_nonnegative check (point_value >= 0),
  constraint board_answers_display_position_positive check (display_position > 0),
  constraint board_answers_sort_order_positive check (sort_order > 0)
);

create index if not exists idx_games_owner_user_id
  on app_public.games (owner_user_id);

create index if not exists idx_games_deleted_at
  on app_public.games (deleted_at);

create index if not exists idx_games_owner_updated_at
  on app_public.games (owner_user_id, updated_at desc);

create index if not exists idx_game_boards_game_id
  on app_public.game_boards (game_id);

create index if not exists idx_game_boards_game_sort_order
  on app_public.game_boards (game_id, sort_order);

create index if not exists idx_board_answers_board_id
  on app_public.board_answers (board_id);

create index if not exists idx_board_answers_board_display_position
  on app_public.board_answers (board_id, display_position);

drop trigger if exists trg_games_set_updated_at on app_public.games;
create trigger trg_games_set_updated_at
before update on app_public.games
for each row
execute function app_private.set_updated_at();

drop trigger if exists trg_game_boards_set_updated_at on app_public.game_boards;
create trigger trg_game_boards_set_updated_at
before update on app_public.game_boards
for each row
execute function app_private.set_updated_at();

drop trigger if exists trg_board_answers_set_updated_at on app_public.board_answers;
create trigger trg_board_answers_set_updated_at
before update on app_public.board_answers
for each row
execute function app_private.set_updated_at();

commit;
