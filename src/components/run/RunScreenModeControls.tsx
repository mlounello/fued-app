"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { setSessionScreen } from "@/actions/sessions";
import type { ScreenMode, SessionSummary } from "@/types/sessions";

const SCREEN_OPTIONS: Array<{ label: string; value: ScreenMode }> = [
  { label: "Pregame", value: "pregame" },
  { label: "Board", value: "board" },
  { label: "Question Overlay", value: "question_overlay" },
  { label: "Postgame", value: "postgame" },
];

export function RunScreenModeControls({
  session,
}: {
  session: SessionSummary | null;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const handleScreenChange = (screen: ScreenMode) => {
    if (!session) {
      return;
    }

    startTransition(async () => {
      await setSessionScreen(session.sessionId, screen);
      router.refresh();
    });
  };

  return (
    <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)] p-4">
      <div className="text-sm text-[color:var(--muted-foreground)]">
        Current screen: {session?.currentScreen ?? "pregame"}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {SCREEN_OPTIONS.map((option) => {
          const isActive = option.value === session?.currentScreen;

          return (
            <button
              key={option.value}
              className={
                isActive
                  ? "rounded-xl bg-[color:var(--accent)] px-3 py-2 text-sm font-semibold text-[color:var(--accent-foreground)]"
                  : "rounded-xl border border-[color:var(--border)] px-3 py-2 text-sm"
              }
              disabled={!session || pending}
              onClick={() => handleScreenChange(option.value)}
              type="button"
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
