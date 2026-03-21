begin;

drop policy if exists fued_profiles_select_own on fued_public.profiles;
create policy fued_profiles_select_own
on fued_public.profiles
for select
to authenticated
using (
  id = auth.uid()
  or fued_private.is_admin()
);

drop policy if exists fued_profiles_update_own on fued_public.profiles;
create policy fued_profiles_update_own
on fued_public.profiles
for update
to authenticated
using (
  id = auth.uid()
  or fued_private.is_admin()
)
with check (
  id = auth.uid()
  or fued_private.is_admin()
);

drop policy if exists fued_profiles_insert_own on fued_public.profiles;
create policy fued_profiles_insert_own
on fued_public.profiles
for insert
to authenticated
with check (
  id = auth.uid()
);

drop policy if exists fued_games_select_owner_or_admin on fued_public.games;
create policy fued_games_select_owner_or_admin
on fued_public.games
for select
to authenticated
using (
  owner_user_id = auth.uid()
  or fued_private.is_admin()
);

drop policy if exists fued_games_insert_owner on fued_public.games;
create policy fued_games_insert_owner
on fued_public.games
for insert
to authenticated
with check (
  owner_user_id = auth.uid()
);

drop policy if exists fued_games_update_owner_or_admin on fued_public.games;
create policy fued_games_update_owner_or_admin
on fued_public.games
for update
to authenticated
using (
  owner_user_id = auth.uid()
  or fued_private.is_admin()
)
with check (
  owner_user_id = auth.uid()
  or fued_private.is_admin()
);

drop policy if exists fued_games_delete_admin_only on fued_public.games;
create policy fued_games_delete_admin_only
on fued_public.games
for delete
to authenticated
using (
  fued_private.is_admin()
);

drop policy if exists fued_game_boards_select_owner_or_admin on fued_public.game_boards;
create policy fued_game_boards_select_owner_or_admin
on fued_public.game_boards
for select
to authenticated
using (
  fued_private.is_admin_or_owner_board(id)
);

drop policy if exists fued_game_boards_insert_owner_or_admin on fued_public.game_boards;
create policy fued_game_boards_insert_owner_or_admin
on fued_public.game_boards
for insert
to authenticated
with check (
  fued_private.is_admin_or_owner_game(game_id)
);

drop policy if exists fued_game_boards_update_owner_or_admin on fued_public.game_boards;
create policy fued_game_boards_update_owner_or_admin
on fued_public.game_boards
for update
to authenticated
using (
  fued_private.is_admin_or_owner_board(id)
)
with check (
  fued_private.is_admin_or_owner_game(game_id)
);

drop policy if exists fued_game_boards_delete_admin_only on fued_public.game_boards;
create policy fued_game_boards_delete_admin_only
on fued_public.game_boards
for delete
to authenticated
using (
  fued_private.is_admin()
);

drop policy if exists fued_board_answers_select_owner_or_admin on fued_public.board_answers;
create policy fued_board_answers_select_owner_or_admin
on fued_public.board_answers
for select
to authenticated
using (
  fued_private.is_admin_or_owner_answer(id)
);

drop policy if exists fued_board_answers_insert_owner_or_admin on fued_public.board_answers;
create policy fued_board_answers_insert_owner_or_admin
on fued_public.board_answers
for insert
to authenticated
with check (
  fued_private.is_admin_or_owner_board(board_id)
);

drop policy if exists fued_board_answers_update_owner_or_admin on fued_public.board_answers;
create policy fued_board_answers_update_owner_or_admin
on fued_public.board_answers
for update
to authenticated
using (
  fued_private.is_admin_or_owner_answer(id)
)
with check (
  fued_private.is_admin_or_owner_board(board_id)
);

drop policy if exists fued_board_answers_delete_admin_only on fued_public.board_answers;
create policy fued_board_answers_delete_admin_only
on fued_public.board_answers
for delete
to authenticated
using (
  fued_private.is_admin()
);

drop policy if exists fued_game_sessions_select_owner_or_admin on fued_public.game_sessions;
create policy fued_game_sessions_select_owner_or_admin
on fued_public.game_sessions
for select
to authenticated
using (
  owner_user_id = auth.uid()
  or fued_private.is_admin()
);

drop policy if exists fued_game_sessions_insert_owner_or_admin on fued_public.game_sessions;
create policy fued_game_sessions_insert_owner_or_admin
on fued_public.game_sessions
for insert
to authenticated
with check (
  owner_user_id = auth.uid()
  or fued_private.is_admin()
);

drop policy if exists fued_game_sessions_update_owner_or_admin on fued_public.game_sessions;
create policy fued_game_sessions_update_owner_or_admin
on fued_public.game_sessions
for update
to authenticated
using (
  owner_user_id = auth.uid()
  or fued_private.is_admin()
)
with check (
  owner_user_id = auth.uid()
  or fued_private.is_admin()
);

drop policy if exists fued_game_sessions_delete_admin_only on fued_public.game_sessions;
create policy fued_game_sessions_delete_admin_only
on fued_public.game_sessions
for delete
to authenticated
using (
  fued_private.is_admin()
);

drop policy if exists fued_session_state_select_owner_or_admin on fued_public.session_state;
create policy fued_session_state_select_owner_or_admin
on fued_public.session_state
for select
to authenticated
using (
  fued_private.is_admin_or_owner_session(session_id)
);

drop policy if exists fued_session_state_insert_owner_or_admin on fued_public.session_state;
create policy fued_session_state_insert_owner_or_admin
on fued_public.session_state
for insert
to authenticated
with check (
  fued_private.is_admin_or_owner_session(session_id)
);

drop policy if exists fued_session_state_update_owner_or_admin on fued_public.session_state;
create policy fued_session_state_update_owner_or_admin
on fued_public.session_state
for update
to authenticated
using (
  fued_private.is_admin_or_owner_session(session_id)
)
with check (
  fued_private.is_admin_or_owner_session(session_id)
);

drop policy if exists fued_session_state_delete_admin_only on fued_public.session_state;
create policy fued_session_state_delete_admin_only
on fued_public.session_state
for delete
to authenticated
using (
  fued_private.is_admin()
);

drop policy if exists fued_session_board_answers_select_owner_or_admin on fued_public.session_board_answers;
create policy fued_session_board_answers_select_owner_or_admin
on fued_public.session_board_answers
for select
to authenticated
using (
  fued_private.is_admin_or_owner_session(session_id)
);

drop policy if exists fued_session_board_answers_insert_owner_or_admin on fued_public.session_board_answers;
create policy fued_session_board_answers_insert_owner_or_admin
on fued_public.session_board_answers
for insert
to authenticated
with check (
  fued_private.is_admin_or_owner_session(session_id)
);

drop policy if exists fued_session_board_answers_update_owner_or_admin on fued_public.session_board_answers;
create policy fued_session_board_answers_update_owner_or_admin
on fued_public.session_board_answers
for update
to authenticated
using (
  fued_private.is_admin_or_owner_session(session_id)
)
with check (
  fued_private.is_admin_or_owner_session(session_id)
);

drop policy if exists fued_session_board_answers_delete_admin_only on fued_public.session_board_answers;
create policy fued_session_board_answers_delete_admin_only
on fued_public.session_board_answers
for delete
to authenticated
using (
  fued_private.is_admin()
);

drop policy if exists fued_game_assets_select_owner_or_admin on fued_public.game_assets;
create policy fued_game_assets_select_owner_or_admin
on fued_public.game_assets
for select
to authenticated
using (
  owner_user_id = auth.uid()
  or fued_private.is_admin()
);

drop policy if exists fued_game_assets_insert_owner_or_admin on fued_public.game_assets;
create policy fued_game_assets_insert_owner_or_admin
on fued_public.game_assets
for insert
to authenticated
with check (
  owner_user_id = auth.uid()
  or fued_private.is_admin()
);

drop policy if exists fued_game_assets_update_owner_or_admin on fued_public.game_assets;
create policy fued_game_assets_update_owner_or_admin
on fued_public.game_assets
for update
to authenticated
using (
  owner_user_id = auth.uid()
  or fued_private.is_admin()
)
with check (
  owner_user_id = auth.uid()
  or fued_private.is_admin()
);

drop policy if exists fued_game_assets_delete_admin_only on fued_public.game_assets;
create policy fued_game_assets_delete_admin_only
on fued_public.game_assets
for delete
to authenticated
using (
  fued_private.is_admin()
);

commit;
