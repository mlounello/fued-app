import { createClient } from "@/lib/supabase/server";

export async function ensureProfile(params: {
  userId: string;
  email: string;
  displayName?: string | null;
}) {
  const supabase = await createClient();

  const { error } = await supabase.schema("app_public").from("profiles").upsert(
    {
      id: params.userId,
      email: params.email,
      display_name: params.displayName ?? null,
      last_login_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  if (error) {
    throw new Error(`Failed to sync profile: ${error.message}`);
  }
}
