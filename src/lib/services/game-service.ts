import { createClient } from "@/lib/supabase/server";
import { resolveSignedAssetMap } from "@/lib/assets/resolve-asset-urls";
import type { GameBoardDetail, GameSettings } from "@/types/games";

export async function getGameEditorData(gameId: string): Promise<{
  game: GameSettings;
  boards: GameBoardDetail[];
}> {
  const supabase = await createClient();

  const { data: game, error: gameError } = await supabase
    .schema("fued_public")
    .from("games")
    .select("*")
    .eq("id", gameId)
    .single();

  if (gameError || !game) {
    throw new Error(`Failed to load game: ${gameError?.message ?? "Not found"}`);
  }

  const { data: boards, error: boardsError } = await supabase
    .schema("fued_public")
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
        sort_order,
        deleted_at
      )
    `)
    .eq("game_id", gameId)
    .is("deleted_at", null)
    .order("sort_order", { ascending: true });

  if (boardsError) {
    throw new Error(`Failed to load boards: ${boardsError.message}`);
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
      throw new Error(`Failed to load game assets: ${assetError.message}`);
    }

    assetMap = await resolveSignedAssetMap(assetRows ?? []);
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
        logoUrl: game.logo_asset_id ? assetMap.get(game.logo_asset_id)?.url ?? null : null,
        pregameAssetId: game.pregame_asset_id,
        pregameUrl: game.pregame_asset_id ? assetMap.get(game.pregame_asset_id)?.url ?? null : null,
        postgameAssetId: game.postgame_asset_id,
        postgameUrl: game.postgame_asset_id ? assetMap.get(game.postgame_asset_id)?.url ?? null : null,
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
        .filter((answer: any) => !answer.deleted_at)
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
