"use server";

import { createClient } from "@/lib/supabase/server";

export async function createAnswer(params: {
  boardId: string;
  answerText: string;
  pointValue: number;
  displayPosition: number;
  sortOrder: number;
}) {
  const supabase = await createClient();

  const { error } = await supabase
    .schema("app_public")
    .from("board_answers")
    .insert({
      board_id: params.boardId,
      answer_text: params.answerText,
      point_value: params.pointValue,
      display_position: params.displayPosition,
      sort_order: params.sortOrder,
    });

  if (error) {
    throw new Error(`Failed to create answer: ${error.message}`);
  }
}

export async function updateAnswer(params: {
  answerId: string;
  answerText: string;
  pointValue: number;
  displayPosition: number;
  sortOrder: number;
}) {
  const supabase = await createClient();

  const { error } = await supabase
    .schema("app_public")
    .from("board_answers")
    .update({
      answer_text: params.answerText,
      point_value: params.pointValue,
      display_position: params.displayPosition,
      sort_order: params.sortOrder,
    })
    .eq("id", params.answerId);

  if (error) {
    throw new Error(`Failed to update answer: ${error.message}`);
  }
}

export async function softDeleteAnswer(answerId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .schema("app_public")
    .from("board_answers")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", answerId);

  if (error) {
    throw new Error(`Failed to delete answer: ${error.message}`);
  }
}
