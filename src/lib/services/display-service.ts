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
