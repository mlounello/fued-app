"use client";

import { useState, useTransition } from "react";

import { createClient } from "@/lib/supabase/browser";

export function GoogleSignInButton() {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-3 border-t border-[color:var(--border)] pt-4">
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <button
        className="w-full rounded-xl border border-[color:var(--border)] bg-white px-4 py-2"
        type="button"
        disabled={pending}
        onClick={() => {
          startTransition(async () => {
            setError(null);
            const supabase = createClient();
            const { error: signInError } = await supabase.auth.signInWithOAuth({
              provider: "google",
              options: {
                redirectTo: `${window.location.origin}/auth/callback`,
              },
            });

            if (signInError) {
              setError(signInError.message);
            }
          });
        }}
      >
        {pending ? "Redirecting..." : "Continue with Google"}
      </button>
    </div>
  );
}
