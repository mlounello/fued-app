import { createClient } from "@/lib/supabase/server";
import type { GameSummary } from "@/types/games";

export async function getDashboardGames(userId: string): Promise<GameSummary[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .schema("app_public")
    .from("games")
    .select(`
      id,
      title,
      status,
      show_team_names,
      show_scores,
      team_1_name,
      team_2_name,
      updated_at,
      deleted_at,
      game_boards(count),
      game_sessions(id, session_status)
    `)
    .eq("owner_user_id", userId)
    .is("deleted_at", null)
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load dashboard games: ${error.message}`);
  }

  return (data ?? []).map((row: any) => ({
    id: row.id,
    title: row.title,
    status: row.status,
    showTeamNames: row.show_team_names,
    showScores: row.show_scores,
    team1Name: row.team_1_name,
    team2Name: row.team_2_name,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at,
    boardCount: row.game_boards?.[0]?.count ?? 0,
    hasLiveSession: (row.game_sessions ?? []).some(
      (session: any) => session.session_status === "live",
    ),
  }));
}
