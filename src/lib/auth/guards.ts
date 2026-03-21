import { redirect } from "next/navigation";

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

  const { data: profile, error } = await supabase
    .schema("app_public")
    .from("profiles")
    .select("id, email, is_admin, is_disabled, display_name")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    redirect("/login");
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
