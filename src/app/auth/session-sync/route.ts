import { NextResponse } from "next/server";

import { ensureProfile } from "@/lib/auth/profile-sync";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
  }

  await ensureProfile({
    userId: user.id,
    email: user.email,
    displayName:
      (typeof user.user_metadata?.full_name === "string" &&
        user.user_metadata.full_name) ||
      (typeof user.user_metadata?.name === "string" && user.user_metadata.name) ||
      null,
  });

  const { data: profile } = await supabase
    .schema("fued_public")
    .from("profiles")
    .select("is_disabled")
    .eq("id", user.id)
    .single();

  if (profile?.is_disabled) {
    await supabase.auth.signOut();
    return NextResponse.json({ ok: false, error: "disabled" }, { status: 403 });
  }

  return NextResponse.json({ ok: true });
}
