"use server";

import { createClient } from "@/lib/supabase/server";
import type { ScoringTarget, ScreenMode } from "@/types/sessions";

export async function launchOrResumeSession(gameId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .schema("fued_public")
    .rpc("launch_or_resume_session", {
      p_game_id: gameId,
    });

  if (error) {
    throw new Error(`Failed to launch or resume session: ${error.message}`);
  }

  return data;
}

export async function changeSessionBoard(sessionId: string, boardId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .schema("fued_public")
    .rpc("change_session_board", {
      p_session_id: sessionId,
      p_board_id: boardId,
    });

  if (error) {
    throw new Error(`Failed to change board: ${error.message}`);
  }

  return data;
}

export async function setSessionScreen(sessionId: string, screen: ScreenMode) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .schema("fued_public")
    .rpc("set_session_screen", {
      p_session_id: sessionId,
      p_screen: screen,
    });

  if (error) {
    throw new Error(`Failed to set screen: ${error.message}`);
  }

  return data;
}

export async function revealAnswer(
  sessionId: string,
  answerId: string,
  scoringTarget: ScoringTarget,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .schema("fued_public")
    .rpc("reveal_answer", {
      p_session_id: sessionId,
      p_answer_id: answerId,
      p_scoring_target: scoringTarget,
    });

  if (error) {
    throw new Error(`Failed to reveal answer: ${error.message}`);
  }

  return data;
}

export async function setScore(sessionId: string, team: 1 | 2, value: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .schema("fued_public")
    .rpc("set_score", {
      p_session_id: sessionId,
      p_team: team,
      p_score: value,
    });

  if (error) {
    throw new Error(`Failed to set score: ${error.message}`);
  }

  return data;
}

export async function addStrike(sessionId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .schema("fued_public")
    .rpc("add_strike", {
      p_session_id: sessionId,
    });

  if (error) {
    throw new Error(`Failed to add strike: ${error.message}`);
  }

  return data;
}

export async function removeStrike(sessionId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .schema("fued_public")
    .rpc("remove_strike", {
      p_session_id: sessionId,
    });

  if (error) {
    throw new Error(`Failed to remove strike: ${error.message}`);
  }

  return data;
}

export async function toggleSound(sessionId: string, enabled: boolean) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .schema("fued_public")
    .rpc("toggle_sound", {
      p_session_id: sessionId,
      p_enabled: enabled,
    });

  if (error) {
    throw new Error(`Failed to toggle sound: ${error.message}`);
  }

  return data;
}

export async function endSession(sessionId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .schema("fued_public")
    .rpc("end_session", {
      p_session_id: sessionId,
    });

  if (error) {
    throw new Error(`Failed to end session: ${error.message}`);
  }

  return data;
}
