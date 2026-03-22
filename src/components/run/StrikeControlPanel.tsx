"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { addStrike, removeStrike } from "@/actions/sessions";
import type { SessionSummary } from "@/types/sessions";

export function StrikeControlPanel({
  session,
  onSessionChange,
}: {
  session: SessionSummary | null;
  onSessionChange: (patch: Partial<SessionSummary>) => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const updateStrikes = (direction: "add" | "remove") => {
    if (!session) {
      return;
    }

    startTransition(async () => {
      let result;
      if (direction === "add") {
        result = await addStrike(session.sessionId);
      } else {
        result = await removeStrike(session.sessionId);
      }
      onSessionChange({
        strikesCount: result.strikesCount,
      });
      router.refresh();
    });
  };

  return (
    <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)] p-6">
      <h2 className="font-semibold">Strikes</h2>
      <div className="mt-2 text-3xl font-bold">{session?.strikesCount ?? 0}</div>
      <div className="mt-3 flex gap-2">
        <button
          className="rounded-xl border border-[color:var(--border)] px-3 py-2 text-sm"
          disabled={!session || pending}
          onClick={() => updateStrikes("remove")}
          type="button"
        >
          Remove Strike
        </button>
        <button
          className="rounded-xl border border-[color:var(--border)] px-3 py-2 text-sm"
          disabled={!session || pending}
          onClick={() => updateStrikes("add")}
          type="button"
        >
          Add Strike
        </button>
      </div>
    </div>
  );
}
