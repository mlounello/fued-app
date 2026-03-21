"use client";

import { useTransition } from "react";

import { revealAnswer } from "@/actions/sessions";

export function RevealActionButtonGroup({
  sessionId,
  answerId,
}: {
  sessionId: string;
  answerId: string;
}) {
  const [pending, startTransition] = useTransition();

  const reveal = (target: "team_1" | "team_2" | "none") => {
    startTransition(async () => {
      await revealAnswer(sessionId, answerId, target);
    });
  };

  return (
    <div className="flex gap-2">
      <button
        className="rounded-xl border border-[color:var(--border)] px-2 py-1 text-sm"
        onClick={() => reveal("team_1")}
        type="button"
        disabled={pending}
      >
        Reveal T1
      </button>
      <button
        className="rounded-xl border border-[color:var(--border)] px-2 py-1 text-sm"
        onClick={() => reveal("team_2")}
        type="button"
        disabled={pending}
      >
        Reveal T2
      </button>
      <button
        className="rounded-xl border border-[color:var(--border)] px-2 py-1 text-sm"
        onClick={() => reveal("none")}
        type="button"
        disabled={pending}
      >
        Reveal Only
      </button>
    </div>
  );
}
