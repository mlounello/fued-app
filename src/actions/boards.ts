"use server";

import { createClient } from "@/lib/supabase/server";

export async function createBoard(
  gameId: string,
  questionText: string,
  sortOrder: number,
) {
  const supabase = await createClient();

  const { error } = await supabase
    .schema("app_public")
    .from("game_boards")
    .insert({
      game_id: gameId,
      question_text: questionText,
      sort_order: sortOrder,
    });

  if (error) {
    throw new Error(`Failed to create board: ${error.message}`);
  }
}

export async function updateBoard(boardId: string, questionText: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .schema("app_public")
    .from("game_boards")
    .update({ question_text: questionText })
    .eq("id", boardId);

  if (error) {
    throw new Error(`Failed to update board: ${error.message}`);
  }
}

export async function softDeleteBoard(boardId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .schema("app_public")
    .from("game_boards")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", boardId);

  if (error) {
    throw new Error(`Failed to delete board: ${error.message}`);
  }
}
