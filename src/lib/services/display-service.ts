import { createClient } from "@/lib/supabase/server";
import { createSignedAssetUrl } from "@/lib/assets/resolve-asset-urls";
import { mapDisplayPayloadData } from "@/lib/display/map-display-payload";
import type { DisplayPayload } from "@/types/display";

export async function getDisplayPayloadByToken(
  token: string,
): Promise<DisplayPayload | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .schema("fued_public")
    .rpc("get_display_payload", { p_public_token: token });

  if (error) {
    throw new Error(`Failed to load display payload: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  const { data: stateRow, error: stateError } = await supabase
    .schema("fued_public")
    .from("session_state")
    .select("show_game_title, show_strikes_bar")
    .eq("session_id", data.session.id)
    .single();

  if (stateError) {
    throw new Error(`Failed to load display presentation state: ${stateError.message}`);
  }

  data.state = {
    ...data.state,
    show_game_title: stateRow?.show_game_title ?? true,
    show_strikes_bar: stateRow?.show_strikes_bar ?? true,
  };

  if (data.assets?.logo) {
    data.assets.logo.url = await createSignedAssetUrl(
      data.assets.logo.bucket,
      data.assets.logo.path,
    );
  }

  if (data.assets?.pregame_image) {
    data.assets.pregame_image.url = await createSignedAssetUrl(
      data.assets.pregame_image.bucket,
      data.assets.pregame_image.path,
    );
  }

  if (data.assets?.postgame_image) {
    data.assets.postgame_image.url = await createSignedAssetUrl(
      data.assets.postgame_image.bucket,
      data.assets.postgame_image.path,
    );
  }

  return mapDisplayPayloadData(data);
}
