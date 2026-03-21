"use server";

import { requireActiveProfile } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { validateAssetFile } from "@/lib/validators/assets";

export async function uploadGameAsset(params: {
  gameId: string;
  assetType: "logo" | "pregame_image" | "postgame_image";
  file: File;
  ownerUserId: string;
}) {
  const { user } = await requireActiveProfile();

  if (params.ownerUserId !== user.id) {
    throw new Error("Invalid asset owner.");
  }

  validateAssetFile(params.file);

  const supabase = await createClient();
  const { data: game, error: gameError } = await supabase
    .schema("fued_public")
    .from("games")
    .select("id, owner_user_id")
    .eq("id", params.gameId)
    .eq("owner_user_id", user.id)
    .is("deleted_at", null)
    .single();

  if (gameError || !game) {
    throw new Error(
      `Failed to validate game ownership: ${gameError?.message ?? "Not found"}`,
    );
  }

  const extension = params.file.name.split(".").pop() ?? "bin";
  const path = `users/${user.id}/games/${params.gameId}/${params.assetType}/${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("fued-game-assets")
    .upload(path, params.file, { upsert: false });

  if (uploadError) {
    throw new Error(`Failed to upload asset: ${uploadError.message}`);
  }

  const { data: assetRow, error: assetError } = await supabase
    .schema("fued_public")
    .from("game_assets")
    .insert({
      owner_user_id: user.id,
      game_id: params.gameId,
      asset_type: params.assetType,
      storage_bucket: "fued-game-assets",
      storage_path: path,
      mime_type: params.file.type,
      file_size_bytes: params.file.size,
      original_filename: params.file.name,
    })
    .select("id")
    .single();

  if (assetError || !assetRow) {
    throw new Error(
      `Failed to create asset row: ${assetError?.message ?? "Unknown error"}`,
    );
  }

  const updateField =
    params.assetType === "logo"
      ? "logo_asset_id"
      : params.assetType === "pregame_image"
        ? "pregame_asset_id"
        : "postgame_asset_id";

  const { error: linkError } = await supabase
    .schema("fued_public")
    .from("games")
    .update({ [updateField]: assetRow.id })
    .eq("id", params.gameId)
    .eq("owner_user_id", user.id);

  if (linkError) {
    throw new Error(`Failed to link asset to game: ${linkError.message}`);
  }

  return assetRow.id;
}
