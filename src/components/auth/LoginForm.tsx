"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/browser";

export function LoginForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        startTransition(async () => {
          setError(null);
          const supabase = createClient();
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (signInError) {
            setError(signInError.message);
            return;
          }

          const syncResponse = await fetch("/auth/session-sync", {
            method: "POST",
          });

          if (!syncResponse.ok) {
            const payload = (await syncResponse.json().catch(() => null)) as
              | { error?: string }
              | null;
            setError(payload?.error === "disabled" ? "This account has been disabled." : "Unable to prepare your profile.");
            return;
          }

          router.push("/dashboard");
          router.refresh();
        });
      }}
    >
      <input
        className="w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <input
        className="w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <button
        className="w-full rounded-xl bg-[color:var(--secondary)] px-4 py-2 text-[color:var(--secondary-foreground)]"
        type="submit"
        disabled={pending}
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
