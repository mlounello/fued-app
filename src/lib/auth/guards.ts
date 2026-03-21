import { redirect } from "next/navigation";

import { ensureProfile } from "@/lib/auth/profile-sync";
import { createClient } from "@/lib/supabase/server";

export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireActiveProfile() {
  const user = await requireUser();
  const supabase = await createClient();

  let { data: profile, error } = await supabase
    .schema("fued_public")
    .from("profiles")
    .select("id, email, is_admin, is_disabled, display_name")
    .eq("id", user.id)
    .single();

  if ((!profile || error) && user.email) {
    await ensureProfile({
      userId: user.id,
      email: user.email,
      displayName:
        (typeof user.user_metadata?.full_name === "string" &&
          user.user_metadata.full_name) ||
        (typeof user.user_metadata?.name === "string" && user.user_metadata.name) ||
        null,
    });

    const profileResult = await supabase
      .schema("fued_public")
      .from("profiles")
      .select("id, email, is_admin, is_disabled, display_name")
      .eq("id", user.id)
      .single();

    profile = profileResult.data;
    error = profileResult.error;
  }

  if (error || !profile) {
    await supabase.auth.signOut();
    redirect("/login?error=profile_sync_failed");
  }

  if (profile.is_disabled) {
    await supabase.auth.signOut();
    redirect("/login?disabled=1");
  }

  return { user, profile };
}

export async function requireAdmin() {
  const { profile } = await requireActiveProfile();

  if (!profile.is_admin) {
    redirect("/dashboard");
  }

  return profile;
}
