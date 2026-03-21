import { createClient } from "@/lib/supabase/server";
import type { GameBoardDetail, GameSettings } from "@/types/games";

export async function getGameEditorData(gameId: string): Promise<{
  game: GameSettings;
  boards: GameBoardDetail[];
}> {
  const supabase = await createClient();

  const { data: game, error: gameError } = await supabase
    .schema("app_public")
    .from("games")
    .select("*")
    .eq("id", gameId)
    .single();

  if (gameError || !game) {
    throw new Error(`Failed to load game: ${gameError?.message ?? "Not found"}`);
  }

  const { data: boards, error: boardsError } = await supabase
    .schema("app_public")
    .from("game_boards")
    .select(`
      id,
      game_id,
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
    throw new Error(`Failed to load boards: ${boardsError.message}`);
  }

  return {
    game: {
      id: game.id,
      ownerUserId: game.owner_user_id,
      title: game.title,
      status: game.status,
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
        logoAssetId: game.logo_asset_id,
        pregameAssetId: game.pregame_asset_id,
        postgameAssetId: game.postgame_asset_id,
      },
      createdAt: game.created_at,
      updatedAt: game.updated_at,
    },
    boards: (boards ?? []).map((board: any) => ({
      id: board.id,
      gameId: board.game_id,
      questionText: board.question_text,
      sortOrder: board.sort_order,
      answers: (board.board_answers ?? [])
        .sort((left: any, right: any) => left.display_position - right.display_position)
        .map((answer: any) => ({
          id: answer.id,
          boardId: answer.board_id,
          answerText: answer.answer_text,
          pointValue: answer.point_value,
          displayPosition: answer.display_position,
          sortOrder: answer.sort_order,
        })),
    })),
  };
}
