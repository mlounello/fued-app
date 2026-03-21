"use server";

import { createClient } from "@/lib/supabase/server";
import { validateAssetFile } from "@/lib/validators/assets";

export async function uploadGameAsset(params: {
  gameId: string;
  assetType: "logo" | "pregame_image" | "postgame_image";
  file: File;
  ownerUserId: string;
}) {
  validateAssetFile(params.file);

  const supabase = await createClient();
  const extension = params.file.name.split(".").pop() ?? "bin";
  const path = `users/${params.ownerUserId}/games/${params.gameId}/${params.assetType}/${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("game-assets")
    .upload(path, params.file, { upsert: false });

  if (uploadError) {
    throw new Error(`Failed to upload asset: ${uploadError.message}`);
  }

  const { data: assetRow, error: assetError } = await supabase
    .schema("app_public")
    .from("game_assets")
    .insert({
      owner_user_id: params.ownerUserId,
      game_id: params.gameId,
      asset_type: params.assetType,
      storage_bucket: "game-assets",
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
    .schema("app_public")
    .from("games")
    .update({ [updateField]: assetRow.id })
    .eq("id", params.gameId);

  if (linkError) {
    throw new Error(`Failed to link asset to game: ${linkError.message}`);
  }

  return assetRow.id;
}
