"use server";

import { revalidatePath } from "next/cache";

import { requireActiveProfile } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { answerSchema } from "@/lib/validators/games";

export async function createAnswer(params: {
  gameId: string;
  boardId: string;
  answerText: string;
  pointValue: number;
  displayPosition: number;
  sortOrder: number;
}) {
  await requireActiveProfile();
  const parsed = answerSchema.parse(params);
  const supabase = await createClient();

  const { error } = await supabase
    .schema("fued_public")
    .from("board_answers")
    .insert({
      board_id: parsed.boardId,
      answer_text: parsed.answerText,
      point_value: parsed.pointValue,
      display_position: parsed.displayPosition,
      sort_order: parsed.sortOrder,
    });

  if (error) {
    throw new Error(`Failed to create answer: ${error.message}`);
  }

  revalidatePath(`/games/${params.gameId}/edit`);
}

export async function updateAnswer(params: {
  gameId: string;
  answerId: string;
  boardId: string;
  answerText: string;
  pointValue: number;
  displayPosition: number;
  sortOrder: number;
}) {
  await requireActiveProfile();
  const parsed = answerSchema.parse(params);
  const supabase = await createClient();

  const { error } = await supabase
    .schema("fued_public")
    .from("board_answers")
    .update({
      answer_text: parsed.answerText,
      point_value: parsed.pointValue,
      display_position: parsed.displayPosition,
      sort_order: parsed.sortOrder,
    })
    .eq("id", params.answerId);

  if (error) {
    throw new Error(`Failed to update answer: ${error.message}`);
  }

  revalidatePath(`/games/${params.gameId}/edit`);
}

export async function softDeleteAnswer(params: {
  gameId: string;
  answerId: string;
}) {
  await requireActiveProfile();
  const supabase = await createClient();

  const { error } = await supabase
    .schema("fued_public")
    .from("board_answers")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", params.answerId);

  if (error) {
    throw new Error(`Failed to delete answer: ${error.message}`);
  }

  revalidatePath(`/games/${params.gameId}/edit`);
}
