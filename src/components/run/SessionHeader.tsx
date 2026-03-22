"use client";

import type { RunScreenData } from "@/types/sessions";

import { DisplayLinkPanel } from "./DisplayLinkPanel";

export function SessionHeader({
  game,
  session,
  pending,
  onLaunch,
  onReset,
  onToggleSound,
  onToggleGameTitle,
  onToggleStrikesBar,
}: {
  game: RunScreenData["game"];
  session: RunScreenData["session"];
  pending: boolean;
  onLaunch: () => void;
  onReset: () => void;
  onToggleSound: () => void;
  onToggleGameTitle: () => void;
  onToggleStrikesBar: () => void;
}) {
  return (
    <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{game.title}</h1>
          <p className="mt-1 text-sm text-[color:var(--muted-foreground)]">
            {session ? `Session is ${session.sessionStatus}` : "No live session yet"}
          </p>
        </div>
        <div className="flex flex-col items-end gap-3">
          {!session ? (
            <button
              className="rounded-xl bg-[color:var(--accent)] px-4 py-2 text-sm font-semibold text-[color:var(--accent-foreground)]"
              onClick={onLaunch}
              type="button"
              disabled={pending}
            >
              Launch Session
            </button>
          ) : null}
          {session ? (
            <div className="flex flex-wrap justify-end gap-2">
              <button
                className="rounded-xl border border-[color:var(--border)] px-3 py-2 text-sm"
                onClick={onToggleSound}
                type="button"
                disabled={pending}
              >
                {session.soundEnabled ? "Sound On" : "Sound Off"}
              </button>
              <button
                className="rounded-xl border border-[color:var(--border)] px-3 py-2 text-sm"
                onClick={onToggleGameTitle}
                type="button"
                disabled={pending}
              >
                {session.showGameTitle ? "Hide Title" : "Show Title"}
              </button>
              <button
                className="rounded-xl border border-[color:var(--border)] px-3 py-2 text-sm"
                onClick={onToggleStrikesBar}
                type="button"
                disabled={pending}
              >
                {session.showStrikesBar ? "Hide Strikes Bar" : "Show Strikes Bar"}
              </button>
              <button
                className="rounded-xl border border-[color:var(--border)] px-3 py-2 text-sm"
                onClick={onReset}
                type="button"
                disabled={pending}
              >
                Reset Session
              </button>
            </div>
          ) : null}
          <DisplayLinkPanel token={session?.publicToken ?? null} />
        </div>
      </div>
    </div>
  );
}
