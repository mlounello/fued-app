"use client";

import { useState, useTransition } from "react";

import { createClient } from "@/lib/supabase/browser";

export function MagicLinkForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="space-y-3 border-t border-[color:var(--border)] pt-4"
      onSubmit={(event) => {
        event.preventDefault();
        startTransition(async () => {
          setError(null);
          setMessage(null);
          const supabase = createClient();
          const { error: signInError } = await supabase.auth.signInWithOtp({
            email,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
          });

          if (signInError) {
            setError(signInError.message);
            return;
          }

          setMessage("Magic link sent.");
        });
      }}
    >
      <label className="block text-sm font-medium">Magic link</label>
      <input
        className="w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      {message ? <p className="text-sm text-green-700">{message}</p> : null}
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <button
        className="w-full rounded-xl border border-[color:var(--border)] px-4 py-2"
        type="submit"
        disabled={pending}
      >
        {pending ? "Sending..." : "Send magic link"}
      </button>
    </form>
  );
}
