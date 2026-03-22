"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import type { ScoringTarget, ScreenMode } from "@/types/sessions";

function normalizeRpcRow<T>(data: T | T[] | null) {
  return Array.isArray(data) ? (data[0] ?? null) : data;
}

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

  const row = normalizeRpcRow(data);

  if (!row) {
    throw new Error("Failed to launch or resume session: empty result");
  }

  return {
    sessionId: row.session_id,
    publicToken: row.public_token,
    sessionStatus: row.session_status,
    currentBoardId: row.current_board_id,
    currentScreen: row.current_screen,
    strikesCount: row.strikes_count,
    soundEnabled: row.sound_enabled,
    showGameTitle: row.show_game_title ?? true,
    showStrikesBar: row.show_strikes_bar ?? true,
    score1: row.score_1,
    score2: row.score_2,
  };
}

export async function launchOrResumeSessionFromOperator(gameId: string) {
  await launchOrResumeSession(gameId);
  revalidatePath(`/games/${gameId}/run`);
  revalidatePath("/dashboard");
  redirect(`/games/${gameId}/run`);
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

  const row = normalizeRpcRow(data);

  if (!row) {
    throw new Error("Failed to change board: empty result");
  }

  return {
    sessionId: row.session_id,
    currentBoardId: row.current_board_id,
    currentScreen: row.current_screen,
    strikesCount: row.strikes_count,
    score1: row.score_1,
    score2: row.score_2,
  };
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

  const row = normalizeRpcRow(data);

  if (!row) {
    throw new Error("Failed to set screen: empty result");
  }

  return {
    sessionId: row.session_id,
    currentBoardId: row.current_board_id,
    currentScreen: row.current_screen,
    strikesCount: row.strikes_count,
    soundEnabled: row.sound_enabled,
    score1: row.score_1,
    score2: row.score_2,
  };
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

  const row = normalizeRpcRow(data);

  if (!row) {
    throw new Error("Failed to reveal answer: empty result");
  }

  return {
    sessionId: row.session_id,
    answerId: row.answer_id,
    isRevealed: row.is_revealed,
    revealedForTeam: row.revealed_for_team,
    score1: row.score_1,
    score2: row.score_2,
  };
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

  const row = normalizeRpcRow(data);

  if (!row) {
    throw new Error("Failed to set score: empty result");
  }

  return {
    sessionId: row.session_id,
    score1: row.score_1,
    score2: row.score_2,
  };
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

  const row = normalizeRpcRow(data);

  if (!row) {
    throw new Error("Failed to add strike: empty result");
  }

  return {
    sessionId: row.session_id,
    strikesCount: row.strikes_count,
  };
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

  const row = normalizeRpcRow(data);

  if (!row) {
    throw new Error("Failed to remove strike: empty result");
  }

  return {
    sessionId: row.session_id,
    strikesCount: row.strikes_count,
  };
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

  const row = normalizeRpcRow(data);

  if (!row) {
    throw new Error("Failed to toggle sound: empty result");
  }

  return {
    sessionId: row.session_id,
    soundEnabled: row.sound_enabled,
  };
}

export async function setSessionPresentationOptions(
  sessionId: string,
  options: {
    showGameTitle?: boolean;
    showStrikesBar?: boolean;
  },
) {
  const supabase = await createClient();

  const update: Record<string, boolean | string> = {
    updated_at: new Date().toISOString(),
  };

  if (options.showGameTitle !== undefined) {
    update.show_game_title = options.showGameTitle;
  }

  if (options.showStrikesBar !== undefined) {
    update.show_strikes_bar = options.showStrikesBar;
  }

  const { data, error } = await supabase
    .schema("fued_public")
    .from("session_state")
    .update(update)
    .eq("session_id", sessionId)
    .select("session_id, show_game_title, show_strikes_bar")
    .single();

  if (error || !data) {
    throw new Error(
      `Failed to update session presentation options: ${error?.message ?? "Unknown error"}`,
    );
  }

  return {
    sessionId: data.session_id,
    showGameTitle: data.show_game_title ?? true,
    showStrikesBar: data.show_strikes_bar ?? true,
  };
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

  const row = normalizeRpcRow(data);

  if (!row) {
    throw new Error("Failed to end session: empty result");
  }

  return {
    sessionId: row.session_id,
    sessionStatus: row.session_status,
    endedAt: row.ended_at,
  };
}

export async function resetSession(sessionId: string) {
  const supabase = await createClient();

  const { data: sessionRow, error: sessionError } = await supabase
    .schema("fued_public")
    .from("game_sessions")
    .select("id, game_id")
    .eq("id", sessionId)
    .single();

  if (sessionError || !sessionRow) {
    throw new Error(`Failed to load session for reset: ${sessionError?.message ?? "Not found"}`);
  }

  const { data: firstBoard, error: boardError } = await supabase
    .schema("fued_public")
    .from("game_boards")
    .select("id")
    .eq("game_id", sessionRow.game_id)
    .is("deleted_at", null)
    .order("sort_order", { ascending: true })
    .limit(1)
    .single();

  if (boardError || !firstBoard) {
    throw new Error(`Failed to load first board for reset: ${boardError?.message ?? "Not found"}`);
  }

  const now = new Date().toISOString();

  const { error: answersError } = await supabase
    .schema("fued_public")
    .from("session_board_answers")
    .update({
      is_revealed: false,
      revealed_at: null,
      revealed_by_user_id: null,
      revealed_for_team: null,
      updated_at: now,
    })
    .eq("session_id", sessionId);

  if (answersError) {
    throw new Error(`Failed to reset answers: ${answersError.message}`);
  }

  const { data: stateRow, error: stateError } = await supabase
    .schema("fued_public")
    .from("session_state")
    .update({
      current_board_id: firstBoard.id,
      current_screen: "pregame",
      strikes_count: 0,
      sound_enabled: true,
      show_game_title: true,
      show_strikes_bar: true,
      score_1: 0,
      score_2: 0,
      updated_at: now,
    })
    .eq("session_id", sessionId)
    .select(
      "session_id, current_board_id, current_screen, strikes_count, sound_enabled, show_game_title, show_strikes_bar, score_1, score_2",
    )
    .single();

  if (stateError || !stateRow) {
    throw new Error(`Failed to reset session state: ${stateError?.message ?? "Unknown error"}`);
  }

  const { error: touchError } = await supabase
    .schema("fued_public")
    .from("game_sessions")
    .update({
      last_activity_at: now,
      updated_at: now,
    })
    .eq("id", sessionId);

  if (touchError) {
    throw new Error(`Failed to update session activity: ${touchError.message}`);
  }

  return {
    sessionId: stateRow.session_id,
    currentBoardId: stateRow.current_board_id,
    currentScreen: stateRow.current_screen,
    strikesCount: stateRow.strikes_count,
    soundEnabled: stateRow.sound_enabled,
    showGameTitle: stateRow.show_game_title ?? true,
    showStrikesBar: stateRow.show_strikes_bar ?? true,
    score1: stateRow.score_1,
    score2: stateRow.score_2,
  };
}
