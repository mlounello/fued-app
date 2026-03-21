begin;

alter table app_public.profiles enable row level security;
alter table app_public.games enable row level security;
alter table app_public.game_boards enable row level security;
alter table app_public.board_answers enable row level security;
alter table app_public.game_sessions enable row level security;
alter table app_public.session_state enable row level security;
alter table app_public.session_board_answers enable row level security;
alter table app_public.game_assets enable row level security;

commit;
