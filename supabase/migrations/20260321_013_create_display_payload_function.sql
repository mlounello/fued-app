begin;

create or replace function fued_public.get_display_payload(
  p_public_token text
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog
as $$
declare
  v_payload jsonb;
begin
  select jsonb_build_object(
    'session', jsonb_build_object(
      'id', s.id,
      'public_token', s.public_token,
      'status', s.session_status,
      'started_at', s.started_at,
      'ended_at', s.ended_at
    ),
    'game', jsonb_build_object(
      'id', g.id,
      'title', g.title,
      'show_team_names', g.show_team_names,
      'show_scores', g.show_scores,
      'team_1_name', g.team_1_name,
      'team_2_name', g.team_2_name,
      'heading_font', g.heading_font,
      'subhead_font', g.subhead_font,
      'body_font', g.body_font,
      'brand_primary_color', g.brand_primary_color,
      'brand_secondary_color', g.brand_secondary_color,
      'brand_accent_color', g.brand_accent_color,
      'brand_background_color', g.brand_background_color
    ),
    'assets', jsonb_build_object(
      'logo', case
        when ga_logo.id is null then null
        else jsonb_build_object(
          'path', ga_logo.storage_path,
          'bucket', ga_logo.storage_bucket,
          'mime_type', ga_logo.mime_type
        )
      end,
      'pregame_image', case
        when ga_pre.id is null then null
        else jsonb_build_object(
          'path', ga_pre.storage_path,
          'bucket', ga_pre.storage_bucket,
          'mime_type', ga_pre.mime_type
        )
      end,
      'postgame_image', case
        when ga_post.id is null then null
        else jsonb_build_object(
          'path', ga_post.storage_path,
          'bucket', ga_post.storage_bucket,
          'mime_type', ga_post.mime_type
        )
      end
    ),
    'state', jsonb_build_object(
      'current_board_id', st.current_board_id,
      'current_screen', st.current_screen,
      'strikes_count', st.strikes_count,
      'sound_enabled', st.sound_enabled,
      'score_1', st.score_1,
      'score_2', st.score_2
    ),
    'boards', (
      select jsonb_agg(
        jsonb_build_object(
          'id', b.id,
          'question_text', b.question_text,
          'sort_order', b.sort_order,
          'answers', (
            select jsonb_agg(
              jsonb_build_object(
                'id', a.id,
                'display_position', a.display_position,
                'sort_order', a.sort_order,
                'point_value', a.point_value,
                'is_revealed', coalesce(sba.is_revealed, false),
                'answer_text', case
                  when coalesce(sba.is_revealed, false) then a.answer_text
                  else null
                end
              )
              order by a.display_position asc, a.sort_order asc, a.created_at asc
            )
            from fued_public.board_answers a
            left join fued_public.session_board_answers sba
              on sba.answer_id = a.id
             and sba.session_id = s.id
            where a.board_id = b.id
              and a.deleted_at is null
          )
        )
        order by b.sort_order asc, b.created_at asc
      )
      from fued_public.game_boards b
      where b.game_id = g.id
        and b.deleted_at is null
    )
  )
  into v_payload
  from fued_public.game_sessions s
  join fued_public.games g on g.id = s.game_id
  join fued_public.session_state st on st.session_id = s.id
  left join fued_public.game_assets ga_logo on ga_logo.id = g.logo_asset_id and ga_logo.deleted_at is null
  left join fued_public.game_assets ga_pre on ga_pre.id = g.pregame_asset_id and ga_pre.deleted_at is null
  left join fued_public.game_assets ga_post on ga_post.id = g.postgame_asset_id and ga_post.deleted_at is null
  where s.public_token = p_public_token
  limit 1;

  return v_payload;
end;
$$;

commit;
