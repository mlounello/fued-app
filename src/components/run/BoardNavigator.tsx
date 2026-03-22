"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { changeSessionBoard } from "@/actions/sessions";
import type { RunBoard, SessionSummary } from "@/types/sessions";

export function BoardNavigator({
  boards,
  session,
  onSessionChange,
}: {
  boards: RunBoard[];
  session: SessionSummary | null;
  onSessionChange: (patch: Partial<SessionSummary>) => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const handleBoardChange = (boardId: string) => {
    if (!session) {
      return;
    }

    startTransition(async () => {
      const result = await changeSessionBoard(session.sessionId, boardId);
      onSessionChange({
        currentBoardId: result.currentBoardId,
        currentScreen: result.currentScreen,
        strikesCount: result.strikesCount,
        score1: result.score1,
        score2: result.score2,
      });
      router.refresh();
    });
  };

  return (
    <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)] p-4">
      <div className="text-sm text-[color:var(--muted-foreground)]">
        Current board: {session?.currentBoardId ?? "None"}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {boards.map((board) => {
          const isActive = board.id === session?.currentBoardId;

          return (
            <button
              key={board.id}
              className={
                isActive
                  ? "rounded-full bg-[color:var(--accent)] px-3 py-1 text-sm font-semibold text-[color:var(--accent-foreground)]"
                  : "rounded-full border border-[color:var(--border)] px-3 py-1 text-sm"
              }
              disabled={!session || pending}
              onClick={() => handleBoardChange(board.id)}
              type="button"
            >
              Board {board.sortOrder}
            </button>
          );
        })}
      </div>
    </div>
  );
}
