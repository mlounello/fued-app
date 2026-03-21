"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireActiveProfile } from "@/lib/auth/guards";
import { DEFAULT_GAME_VALUES } from "@/lib/constants/defaults";
import { createClient } from "@/lib/supabase/server";
import { updateGameSettingsSchema } from "@/lib/validators/games";

export async function createGame() {
  const { user } = await requireActiveProfile();
  const supabase = await createClient();

  const { data, error } = await supabase
    .schema("fued_public")
    .from("games")
    .insert({
      owner_user_id: user.id,
      title: DEFAULT_GAME_VALUES.title,
      show_team_names: DEFAULT_GAME_VALUES.showTeamNames,
      show_scores: DEFAULT_GAME_VALUES.showScores,
      team_1_name: DEFAULT_GAME_VALUES.team1Name,
      team_2_name: DEFAULT_GAME_VALUES.team2Name,
      brand_primary_color: DEFAULT_GAME_VALUES.brandPrimaryColor,
      brand_secondary_color: DEFAULT_GAME_VALUES.brandSecondaryColor,
      brand_accent_color: DEFAULT_GAME_VALUES.brandAccentColor,
      brand_background_color: DEFAULT_GAME_VALUES.brandBackgroundColor,
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(
      `Failed to create game: ${error?.message ?? "Unknown error"}`,
    );
  }

  redirect(`/games/${data.id}/edit`);
}

export async function updateGameSettings(input: unknown) {
  await requireActiveProfile();
  const parsed = updateGameSettingsSchema.parse(input);
  const supabase = await createClient();

  const { error } = await supabase
    .schema("fued_public")
    .from("games")
    .update({
      title: parsed.title,
      show_team_names: parsed.showTeamNames,
      show_scores: parsed.showScores,
      team_1_name: parsed.team1Name,
      team_2_name: parsed.team2Name,
      brand_primary_color: parsed.brandPrimaryColor,
      brand_secondary_color: parsed.brandSecondaryColor,
      brand_accent_color: parsed.brandAccentColor,
      brand_background_color: parsed.brandBackgroundColor,
    })
    .eq("id", parsed.gameId);

  if (error) {
    throw new Error(`Failed to update game settings: ${error.message}`);
  }

  revalidatePath(`/games/${parsed.gameId}/edit`);
  revalidatePath("/dashboard");
}

export async function softDeleteGame(gameId: string) {
  await requireActiveProfile();
  const supabase = await createClient();

  const { error } = await supabase
    .schema("fued_public")
    .from("games")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", gameId);

  if (error) {
    throw new Error(`Failed to delete game: ${error.message}`);
  }

  revalidatePath("/dashboard");
}

export async function duplicateGame(gameId: string) {
  const { user } = await requireActiveProfile();
  const supabase = await createClient();

  const { data: originalGame, error: gameError } = await supabase
    .schema("fued_public")
    .from("games")
    .select("*")
    .eq("id", gameId)
    .is("deleted_at", null)
    .single();

  if (gameError || !originalGame) {
    throw new Error(`Failed to load game for duplication: ${gameError?.message ?? "Not found"}`);
  }

  const { data: originalBoards, error: boardsError } = await supabase
    .schema("fued_public")
    .from("game_boards")
    .select(`
      id,
      question_text,
      sort_order,
      board_answers (
        id,
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
    throw new Error(`Failed to load boards for duplication: ${boardsError.message}`);
  }

  const { data: newGame, error: insertGameError } = await supabase
    .schema("fued_public")
    .from("games")
    .insert({
      owner_user_id: user.id,
      title: `${originalGame.title} Copy`,
      status: "draft",
      show_team_names: originalGame.show_team_names,
      show_scores: originalGame.show_scores,
      team_1_name: originalGame.team_1_name,
      team_2_name: originalGame.team_2_name,
      heading_font: originalGame.heading_font,
      subhead_font: originalGame.subhead_font,
      body_font: originalGame.body_font,
      brand_primary_color: originalGame.brand_primary_color,
      brand_secondary_color: originalGame.brand_secondary_color,
      brand_accent_color: originalGame.brand_accent_color,
      brand_background_color: originalGame.brand_background_color,
      logo_asset_id: null,
      pregame_asset_id: null,
      postgame_asset_id: null,
    })
    .select("id")
    .single();

  if (insertGameError || !newGame) {
    throw new Error(`Failed to create duplicated game: ${insertGameError?.message ?? "Unknown error"}`);
  }

  for (const board of originalBoards ?? []) {
    const { data: newBoard, error: insertBoardError } = await supabase
      .schema("fued_public")
      .from("game_boards")
      .insert({
        game_id: newGame.id,
        question_text: board.question_text,
        sort_order: board.sort_order,
      })
      .select("id")
      .single();

    if (insertBoardError || !newBoard) {
      throw new Error(`Failed to duplicate board: ${insertBoardError?.message ?? "Unknown error"}`);
    }

    const answers = (board.board_answers ?? []).filter(
      (answer: any) => !answer.deleted_at,
    );

    if (!answers.length) {
      continue;
    }

    const { error: insertAnswersError } = await supabase
      .schema("fued_public")
      .from("board_answers")
      .insert(
        answers.map((answer: any) => ({
          board_id: newBoard.id,
          answer_text: answer.answer_text,
          point_value: answer.point_value,
          display_position: answer.display_position,
          sort_order: answer.sort_order,
        })),
      );

    if (insertAnswersError) {
      throw new Error(`Failed to duplicate answers: ${insertAnswersError.message}`);
    }
  }

  revalidatePath("/dashboard");
}
