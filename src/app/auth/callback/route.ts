import { NextResponse } from "next/server";

import { ensureProfile } from "@/lib/auth/profile-sync";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/dashboard";

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=missing_code", request.url));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(new URL("/login?error=auth_callback_failed", request.url));
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.email) {
    await ensureProfile({
      userId: user.id,
      email: user.email,
      displayName:
        (typeof user.user_metadata?.full_name === "string" && user.user_metadata.full_name) ||
        (typeof user.user_metadata?.name === "string" && user.user_metadata.name) ||
        null,
    });
  }

  return NextResponse.redirect(new URL(next, request.url));
}
