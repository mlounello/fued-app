"use server";

import { createClient } from "@/lib/supabase/server";

export async function setUserDisabled(userId: string, disabled: boolean) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .schema("fued_public")
    .rpc("admin_set_user_disabled", {
      p_user_id: userId,
      p_disabled: disabled,
    });

  if (error) {
    throw new Error(`Failed to update user disabled state: ${error.message}`);
  }

  return data;
}

export async function adminSoftDeleteGame(gameId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .schema("fued_public")
    .rpc("admin_soft_delete_game", {
      p_game_id: gameId,
    });

  if (error) {
    throw new Error(`Failed to admin delete game: ${error.message}`);
  }

  return data;
}
