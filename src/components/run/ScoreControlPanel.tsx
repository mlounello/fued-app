"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { setScore } from "@/actions/sessions";
import type { RunScreenData } from "@/types/sessions";

export function ScoreControlPanel({
  game,
  session,
}: {
  game: RunScreenData["game"];
  session: RunScreenData["session"];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const updateScore = (team: 1 | 2, nextValue: number) => {
    if (!session) {
      return;
    }

    startTransition(async () => {
      await setScore(session.sessionId, team, Math.max(0, nextValue));
      router.refresh();
    });
  };

  const team1Score = session?.score1 ?? 0;
  const team2Score = session?.score2 ?? 0;

  return (
    <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)] p-6">
      <h2 className="font-semibold">Scores</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-white/70 p-4">
          <div className="text-sm text-[color:var(--muted-foreground)]">{game.team1Name}</div>
          <div className="text-3xl font-bold">{team1Score}</div>
          <div className="mt-3 flex gap-2">
            <button
              className="rounded-xl border border-[color:var(--border)] px-3 py-2 text-sm"
              disabled={!session || pending}
              onClick={() => updateScore(1, team1Score - 1)}
              type="button"
            >
              -1
            </button>
            <button
              className="rounded-xl border border-[color:var(--border)] px-3 py-2 text-sm"
              disabled={!session || pending}
              onClick={() => updateScore(1, team1Score + 1)}
              type="button"
            >
              +1
            </button>
          </div>
        </div>
        <div className="rounded-2xl bg-white/70 p-4">
          <div className="text-sm text-[color:var(--muted-foreground)]">{game.team2Name}</div>
          <div className="text-3xl font-bold">{team2Score}</div>
          <div className="mt-3 flex gap-2">
            <button
              className="rounded-xl border border-[color:var(--border)] px-3 py-2 text-sm"
              disabled={!session || pending}
              onClick={() => updateScore(2, team2Score - 1)}
              type="button"
            >
              -1
            </button>
            <button
              className="rounded-xl border border-[color:var(--border)] px-3 py-2 text-sm"
              disabled={!session || pending}
              onClick={() => updateScore(2, team2Score + 1)}
              type="button"
            >
              +1
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
