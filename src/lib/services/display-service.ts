import { createClient } from "@/lib/supabase/server";
import type { DisplayPayload } from "@/types/display";

export async function getDisplayPayloadByToken(
  token: string,
): Promise<DisplayPayload | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .schema("app_public")
    .rpc("get_display_payload", { p_public_token: token });

  if (error) {
    throw new Error(`Failed to load display payload: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  return {
    session: {
      id: data.session.id,
      publicToken: data.session.public_token,
      status: data.session.status,
      startedAt: data.session.started_at,
      endedAt: data.session.ended_at,
    },
    game: {
      id: data.game.id,
      title: data.game.title,
      showTeamNames: data.game.show_team_names,
      showScores: data.game.show_scores,
      team1Name: data.game.team_1_name,
      team2Name: data.game.team_2_name,
      headingFont: data.game.heading_font,
      subheadFont: data.game.subhead_font,
      bodyFont: data.game.body_font,
      brandPrimaryColor: data.game.brand_primary_color,
      brandSecondaryColor: data.game.brand_secondary_color,
      brandAccentColor: data.game.brand_accent_color,
      brandBackgroundColor: data.game.brand_background_color,
    },
    assets: {
      logo: data.assets.logo
        ? {
            path: data.assets.logo.path,
            bucket: data.assets.logo.bucket,
            mimeType: data.assets.logo.mime_type,
          }
        : null,
      pregameImage: data.assets.pregame_image
        ? {
            path: data.assets.pregame_image.path,
            bucket: data.assets.pregame_image.bucket,
            mimeType: data.assets.pregame_image.mime_type,
          }
        : null,
      postgameImage: data.assets.postgame_image
        ? {
            path: data.assets.postgame_image.path,
            bucket: data.assets.postgame_image.bucket,
            mimeType: data.assets.postgame_image.mime_type,
          }
        : null,
    },
    state: {
      currentBoardId: data.state.current_board_id,
      currentScreen: data.state.current_screen,
      strikesCount: data.state.strikes_count,
      soundEnabled: data.state.sound_enabled,
      score1: data.state.score_1,
      score2: data.state.score_2,
    },
    boards: (data.boards ?? []).map((board: any) => ({
      id: board.id,
      questionText: board.question_text,
      sortOrder: board.sort_order,
      answers: (board.answers ?? []).map((answer: any) => ({
        id: answer.id,
        displayPosition: answer.display_position,
        sortOrder: answer.sort_order,
        pointValue: answer.point_value,
        isRevealed: answer.is_revealed,
        answerText: answer.answer_text,
      })),
    })),
  };
}
