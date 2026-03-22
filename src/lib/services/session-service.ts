import { createClient } from "@/lib/supabase/server";
import { resolveSignedAssetMap } from "@/lib/assets/resolve-asset-urls";
import type { RunScreenData } from "@/types/sessions";

export async function getRunScreenData(gameId: string): Promise<RunScreenData> {
  const supabase = await createClient();

  const { data: game, error: gameError } = await supabase
    .schema("fued_public")
    .from("games")
    .select("*")
    .eq("id", gameId)
    .single();

  if (gameError || !game) {
    throw new Error(
      `Failed to load run game: ${gameError?.message ?? "Not found"}`,
    );
  }

  const { data: boards, error: boardsError } = await supabase
    .schema("fued_public")
    .from("game_boards")
    .select(`
      id,
      question_text,
      sort_order,
      board_answers (
        id,
        board_id,
        answer_text,
        point_value,
        display_position,
        sort_order
      )
    `)
    .eq("game_id", gameId)
    .is("deleted_at", null)
    .order("sort_order", { ascending: true });

  if (boardsError) {
    throw new Error(`Failed to load run boards: ${boardsError.message}`);
  }

  const { data: sessionRows, error: sessionError } = await supabase
    .schema("fued_public")
    .from("game_sessions")
    .select(`
      id,
      public_token,
      session_status,
      session_state (
        current_board_id,
        current_screen,
        strikes_count,
        sound_enabled,
        show_game_title,
        show_strikes_bar,
        score_1,
        score_2
      )
    `)
    .eq("game_id", gameId)
    .eq("session_status", "live")
    .order("created_at", { ascending: false })
    .limit(1);

  if (sessionError) {
    throw new Error(`Failed to load session: ${sessionError.message}`);
  }

  const assetIds = [
    game.logo_asset_id,
    game.pregame_asset_id,
    game.postgame_asset_id,
  ].filter(Boolean);

  let assetMap = new Map<
    string,
    {
      id: string;
      url: string;
      mimeType: string;
      originalFilename: string | null;
      bucket: string;
      path: string;
    }
  >();

  if (assetIds.length) {
    const { data: assetRows, error: assetError } = await supabase
      .schema("fued_public")
      .from("game_assets")
      .select("id, storage_bucket, storage_path, mime_type, original_filename")
      .in("id", assetIds)
      .is("deleted_at", null);

    if (assetError) {
      throw new Error(`Failed to load session assets: ${assetError.message}`);
    }

    assetMap = await resolveSignedAssetMap(assetRows ?? []);
  }

  const session = sessionRows?.[0] ?? null;

  let revealedMap = new Map<
    string,
    {
      isRevealed: boolean;
      revealedForTeam: "team_1" | "team_2" | "none" | null;
    }
  >();

  if (session) {
    const { data: revealedRows, error: revealedError } = await supabase
      .schema("fued_public")
      .from("session_board_answers")
      .select("answer_id, is_revealed, revealed_for_team")
      .eq("session_id", session.id);

    if (revealedError) {
      throw new Error(`Failed to load session answers: ${revealedError.message}`);
    }

    revealedMap = new Map(
      (revealedRows ?? []).map((row: any) => [
        row.answer_id,
        {
          isRevealed: row.is_revealed,
          revealedForTeam: row.revealed_for_team,
        },
      ]),
    );
  }

  return {
    game: {
      id: game.id,
      title: game.title,
      showTeamNames: game.show_team_names,
      showScores: game.show_scores,
      team1Name: game.team_1_name,
      team2Name: game.team_2_name,
      branding: {
        headingFont: game.heading_font,
        subheadFont: game.subhead_font,
        bodyFont: game.body_font,
        brandPrimaryColor: game.brand_primary_color,
        brandSecondaryColor: game.brand_secondary_color,
        brandAccentColor: game.brand_accent_color,
        brandBackgroundColor: game.brand_background_color,
      },
      assets: {
        logoUrl: game.logo_asset_id ? assetMap.get(game.logo_asset_id)?.url ?? null : null,
        pregameUrl: game.pregame_asset_id ? assetMap.get(game.pregame_asset_id)?.url ?? null : null,
        postgameUrl: game.postgame_asset_id ? assetMap.get(game.postgame_asset_id)?.url ?? null : null,
      },
    },
    session: session
      ? {
          sessionId: session.id,
          publicToken: session.public_token,
          sessionStatus: session.session_status,
          currentBoardId: session.session_state?.[0]?.current_board_id ?? null,
          currentScreen: session.session_state?.[0]?.current_screen ?? "pregame",
          strikesCount: session.session_state?.[0]?.strikes_count ?? 0,
          soundEnabled: session.session_state?.[0]?.sound_enabled ?? true,
          showGameTitle: session.session_state?.[0]?.show_game_title ?? true,
          showStrikesBar: session.session_state?.[0]?.show_strikes_bar ?? true,
          score1: session.session_state?.[0]?.score_1 ?? 0,
          score2: session.session_state?.[0]?.score_2 ?? 0,
        }
      : null,
    boards: (boards ?? []).map((board: any) => ({
      id: board.id,
      questionText: board.question_text,
      sortOrder: board.sort_order,
      answers: (board.board_answers ?? [])
        .sort((left: any, right: any) => left.display_position - right.display_position)
        .map((answer: any) => {
          const reveal = revealedMap.get(answer.id);
          return {
            id: answer.id,
            boardId: answer.board_id,
            answerText: answer.answer_text,
            pointValue: answer.point_value,
            displayPosition: answer.display_position,
            sortOrder: answer.sort_order,
            isRevealed: reveal?.isRevealed ?? false,
            revealedForTeam: reveal?.revealedForTeam ?? null,
          };
        }),
    })),
  };
}
