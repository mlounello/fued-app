import { createClient } from "@/lib/supabase/server";
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

  return mapDisplayPayloadData(data);
}
