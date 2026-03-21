import { redirect } from "next/navigation";

import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { LoginForm } from "@/components/auth/LoginForm";
import { MagicLinkForm } from "@/components/auth/MagicLinkForm";
import { createClient } from "@/lib/supabase/server";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; disabled?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  const message = params.disabled
    ? "This account has been disabled."
    : params.error
      ? decodeURIComponent(params.error)
      : null;

  return (
    <main className="flex min-h-[75vh] items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)] p-6 shadow-[0_20px_60px_rgba(17,24,39,0.08)]">
        <div>
          <h1 className="text-3xl font-bold">Sign In</h1>
          <p className="mt-2 text-sm text-[color:var(--muted-foreground)]">
            Access the operator dashboard.
          </p>
        </div>
        {message ? (
          <div className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {message}
          </div>
        ) : null}
        <LoginForm />
        <MagicLinkForm />
        <GoogleSignInButton />
      </div>
    </main>
  );
}
