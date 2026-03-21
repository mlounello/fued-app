"use server";

import { revalidatePath } from "next/cache";

import { requireActiveProfile } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { boardSchema } from "@/lib/validators/games";

export async function createBoard(input: {
  gameId: string;
  questionText: string;
  sortOrder: number;
}) {
  await requireActiveProfile();
  const parsed = boardSchema.parse(input);
  const supabase = await createClient();

  const { error } = await supabase
    .schema("fued_public")
    .from("game_boards")
    .insert({
      game_id: parsed.gameId,
      question_text: parsed.questionText,
      sort_order: parsed.sortOrder,
    });

  if (error) {
    throw new Error(`Failed to create board: ${error.message}`);
  }

  revalidatePath(`/games/${parsed.gameId}/edit`);
}

export async function updateBoard(input: {
  boardId: string;
  gameId: string;
  questionText: string;
}) {
  await requireActiveProfile();
  const supabase = await createClient();

  const { error } = await supabase
    .schema("fued_public")
    .from("game_boards")
    .update({ question_text: input.questionText })
    .eq("id", input.boardId);

  if (error) {
    throw new Error(`Failed to update board: ${error.message}`);
  }

  revalidatePath(`/games/${input.gameId}/edit`);
}

export async function softDeleteBoard(input: { boardId: string; gameId: string }) {
  await requireActiveProfile();
  const supabase = await createClient();

  const { error } = await supabase
    .schema("fued_public")
    .from("game_boards")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", input.boardId);

  if (error) {
    throw new Error(`Failed to delete board: ${error.message}`);
  }

  revalidatePath(`/games/${input.gameId}/edit`);
}
