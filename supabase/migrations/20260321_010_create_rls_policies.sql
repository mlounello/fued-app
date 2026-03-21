begin;

drop policy if exists profiles_select_own on app_public.profiles;
create policy profiles_select_own
on app_public.profiles
for select
to authenticated
using (
  id = auth.uid()
  or app_private.is_admin()
);

drop policy if exists profiles_update_own on app_public.profiles;
create policy profiles_update_own
on app_public.profiles
for update
to authenticated
using (
  id = auth.uid()
  or app_private.is_admin()
)
with check (
  id = auth.uid()
  or app_private.is_admin()
);

drop policy if exists profiles_insert_own on app_public.profiles;
create policy profiles_insert_own
on app_public.profiles
for insert
to authenticated
with check (
  id = auth.uid()
);

drop policy if exists games_select_owner_or_admin on app_public.games;
create policy games_select_owner_or_admin
on app_public.games
for select
to authenticated
using (
  owner_user_id = auth.uid()
  or app_private.is_admin()
);

drop policy if exists games_insert_owner on app_public.games;
create policy games_insert_owner
on app_public.games
for insert
to authenticated
with check (
  owner_user_id = auth.uid()
);

drop policy if exists games_update_owner_or_admin on app_public.games;
create policy games_update_owner_or_admin
on app_public.games
for update
to authenticated
using (
  owner_user_id = auth.uid()
  or app_private.is_admin()
)
with check (
  owner_user_id = auth.uid()
  or app_private.is_admin()
);

drop policy if exists games_delete_admin_only on app_public.games;
create policy games_delete_admin_only
on app_public.games
for delete
to authenticated
using (
  app_private.is_admin()
);

drop policy if exists game_boards_select_owner_or_admin on app_public.game_boards;
create policy game_boards_select_owner_or_admin
on app_public.game_boards
for select
to authenticated
using (
  app_private.is_admin_or_owner_board(id)
);

drop policy if exists game_boards_insert_owner_or_admin on app_public.game_boards;
create policy game_boards_insert_owner_or_admin
on app_public.game_boards
for insert
to authenticated
with check (
  app_private.is_admin_or_owner_game(game_id)
);

drop policy if exists game_boards_update_owner_or_admin on app_public.game_boards;
create policy game_boards_update_owner_or_admin
on app_public.game_boards
for update
to authenticated
using (
  app_private.is_admin_or_owner_board(id)
)
with check (
  app_private.is_admin_or_owner_game(game_id)
);

drop policy if exists game_boards_delete_admin_only on app_public.game_boards;
create policy game_boards_delete_admin_only
on app_public.game_boards
for delete
to authenticated
using (
  app_private.is_admin()
);

drop policy if exists board_answers_select_owner_or_admin on app_public.board_answers;
create policy board_answers_select_owner_or_admin
on app_public.board_answers
for select
to authenticated
using (
  app_private.is_admin_or_owner_answer(id)
);

drop policy if exists board_answers_insert_owner_or_admin on app_public.board_answers;
create policy board_answers_insert_owner_or_admin
on app_public.board_answers
for insert
to authenticated
with check (
  app_private.is_admin_or_owner_board(board_id)
);

drop policy if exists board_answers_update_owner_or_admin on app_public.board_answers;
create policy board_answers_update_owner_or_admin
on app_public.board_answers
for update
to authenticated
using (
  app_private.is_admin_or_owner_answer(id)
)
with check (
  app_private.is_admin_or_owner_board(board_id)
);

drop policy if exists board_answers_delete_admin_only on app_public.board_answers;
create policy board_answers_delete_admin_only
on app_public.board_answers
for delete
to authenticated
using (
  app_private.is_admin()
);

drop policy if exists game_sessions_select_owner_or_admin on app_public.game_sessions;
create policy game_sessions_select_owner_or_admin
on app_public.game_sessions
for select
to authenticated
using (
  owner_user_id = auth.uid()
  or app_private.is_admin()
);

drop policy if exists game_sessions_insert_owner_or_admin on app_public.game_sessions;
create policy game_sessions_insert_owner_or_admin
on app_public.game_sessions
for insert
to authenticated
with check (
  owner_user_id = auth.uid()
  or app_private.is_admin()
);

drop policy if exists game_sessions_update_owner_or_admin on app_public.game_sessions;
create policy game_sessions_update_owner_or_admin
on app_public.game_sessions
for update
to authenticated
using (
  owner_user_id = auth.uid()
  or app_private.is_admin()
)
with check (
  owner_user_id = auth.uid()
  or app_private.is_admin()
);

drop policy if exists game_sessions_delete_admin_only on app_public.game_sessions;
create policy game_sessions_delete_admin_only
on app_public.game_sessions
for delete
to authenticated
using (
  app_private.is_admin()
);

drop policy if exists session_state_select_owner_or_admin on app_public.session_state;
create policy session_state_select_owner_or_admin
on app_public.session_state
for select
to authenticated
using (
  app_private.is_admin_or_owner_session(session_id)
);

drop policy if exists session_state_insert_owner_or_admin on app_public.session_state;
create policy session_state_insert_owner_or_admin
on app_public.session_state
for insert
to authenticated
with check (
  app_private.is_admin_or_owner_session(session_id)
);

drop policy if exists session_state_update_owner_or_admin on app_public.session_state;
create policy session_state_update_owner_or_admin
on app_public.session_state
for update
to authenticated
using (
  app_private.is_admin_or_owner_session(session_id)
)
with check (
  app_private.is_admin_or_owner_session(session_id)
);

drop policy if exists session_state_delete_admin_only on app_public.session_state;
create policy session_state_delete_admin_only
on app_public.session_state
for delete
to authenticated
using (
  app_private.is_admin()
);

drop policy if exists session_board_answers_select_owner_or_admin on app_public.session_board_answers;
create policy session_board_answers_select_owner_or_admin
on app_public.session_board_answers
for select
to authenticated
using (
  app_private.is_admin_or_owner_session(session_id)
);

drop policy if exists session_board_answers_insert_owner_or_admin on app_public.session_board_answers;
create policy session_board_answers_insert_owner_or_admin
on app_public.session_board_answers
for insert
to authenticated
with check (
  app_private.is_admin_or_owner_session(session_id)
);

drop policy if exists session_board_answers_update_owner_or_admin on app_public.session_board_answers;
create policy session_board_answers_update_owner_or_admin
on app_public.session_board_answers
for update
to authenticated
using (
  app_private.is_admin_or_owner_session(session_id)
)
with check (
  app_private.is_admin_or_owner_session(session_id)
);

drop policy if exists session_board_answers_delete_admin_only on app_public.session_board_answers;
create policy session_board_answers_delete_admin_only
on app_public.session_board_answers
for delete
to authenticated
using (
  app_private.is_admin()
);

drop policy if exists game_assets_select_owner_or_admin on app_public.game_assets;
create policy game_assets_select_owner_or_admin
on app_public.game_assets
for select
to authenticated
using (
  owner_user_id = auth.uid()
  or app_private.is_admin()
);

drop policy if exists game_assets_insert_owner_or_admin on app_public.game_assets;
create policy game_assets_insert_owner_or_admin
on app_public.game_assets
for insert
to authenticated
with check (
  owner_user_id = auth.uid()
  or app_private.is_admin()
);

drop policy if exists game_assets_update_owner_or_admin on app_public.game_assets;
create policy game_assets_update_owner_or_admin
on app_public.game_assets
for update
to authenticated
using (
  owner_user_id = auth.uid()
  or app_private.is_admin()
)
with check (
  owner_user_id = auth.uid()
  or app_private.is_admin()
);

drop policy if exists game_assets_delete_admin_only on app_public.game_assets;
create policy game_assets_delete_admin_only
on app_public.game_assets
for delete
to authenticated
using (
  app_private.is_admin()
);

commit;
