begin;

grant usage on schema fued_public to anon, authenticated, service_role;
grant usage on schema fued_private to service_role;
grant usage on schema fued_audit to service_role;

revoke all on all tables in schema fued_public from anon;
revoke all on all tables in schema fued_private from anon;
revoke all on all tables in schema fued_audit from anon;

grant select, insert, update on table fued_public.profiles to authenticated;
grant select, insert, update on table fued_public.games to authenticated;
grant select, insert, update on table fued_public.game_boards to authenticated;
grant select, insert, update on table fued_public.board_answers to authenticated;
grant select, insert, update on table fued_public.game_sessions to authenticated;
grant select, insert, update on table fued_public.session_state to authenticated;
grant select, insert, update on table fued_public.session_board_answers to authenticated;
grant select, insert, update on table fued_public.game_assets to authenticated;

grant all privileges on all tables in schema fued_public to service_role;
grant all privileges on all tables in schema fued_private to service_role;
grant all privileges on all tables in schema fued_audit to service_role;

grant usage, select on all sequences in schema fued_public to service_role;
grant usage, select on all sequences in schema fued_private to service_role;
grant usage, select on all sequences in schema fued_audit to service_role;

revoke all on all functions in schema fued_public from public;
revoke all on all functions in schema fued_private from public;
revoke all on all functions in schema fued_audit from public;

grant execute on function fued_public.get_display_payload(text) to anon;
grant execute on function fued_public.get_display_payload(text) to authenticated;
grant execute on function fued_public.launch_or_resume_session(uuid) to authenticated;
grant execute on function fued_public.change_session_board(uuid, uuid) to authenticated;
grant execute on function fued_public.set_session_screen(uuid, fued_public.screen_mode) to authenticated;
grant execute on function fued_public.reveal_answer(uuid, uuid, fued_public.scoring_target) to authenticated;
grant execute on function fued_public.set_score(uuid, integer, integer) to authenticated;
grant execute on function fued_public.add_strike(uuid) to authenticated;
grant execute on function fued_public.remove_strike(uuid) to authenticated;
grant execute on function fued_public.toggle_sound(uuid, boolean) to authenticated;
grant execute on function fued_public.end_session(uuid) to authenticated;
grant execute on function fued_public.admin_set_user_disabled(uuid, boolean) to authenticated;
grant execute on function fued_public.admin_soft_delete_game(uuid) to authenticated;
grant execute on all functions in schema fued_public to service_role;

commit;
