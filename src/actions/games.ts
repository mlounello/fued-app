"use server";

import { redirect } from "next/navigation";

import { requireActiveProfile } from "@/lib/auth/guards";
import { DEFAULT_GAME_VALUES } from "@/lib/constants/defaults";
import { createClient } from "@/lib/supabase/server";
import { updateGameSettingsSchema } from "@/lib/validators/games";

export async function createGame() {
  const { user } = await requireActiveProfile();
  const supabase = await createClient();

  const { data, error } = await supabase
    .schema("app_public")
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
  const parsed = updateGameSettingsSchema.parse(input);
  const supabase = await createClient();

  const { error } = await supabase
    .schema("app_public")
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
}

export async function softDeleteGame(gameId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .schema("app_public")
    .from("games")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", gameId);

  if (error) {
    throw new Error(`Failed to delete game: ${error.message}`);
  }
}

export async function duplicateGame(_gameId: string) {
  throw new Error("Not implemented yet");
}
