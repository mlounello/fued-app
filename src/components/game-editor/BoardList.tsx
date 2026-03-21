 "use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { createBoard } from "@/actions/boards";
import type { GameBoardDetail } from "@/types/games";

import { BoardEditor } from "./BoardEditor";

export function BoardList({
  boards,
  gameId,
}: {
  boards: GameBoardDetail[];
  gameId: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [questionText, setQuestionText] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {boards.map((board) => (
        <BoardEditor key={board.id} board={board} gameId={gameId} />
      ))}
      <form
        className="rounded-3xl border border-dashed border-[color:var(--border)] bg-white/50 p-6"
        onSubmit={(event) => {
          event.preventDefault();
          startTransition(async () => {
            try {
              setError(null);
              await createBoard({
                gameId,
                questionText,
                sortOrder: boards.length + 1,
              });
              setQuestionText("");
              router.refresh();
            } catch (caughtError) {
              setError(
                caughtError instanceof Error ? caughtError.message : "Unable to create board.",
              );
            }
          });
        }}
      >
        <h3 className="font-semibold">Add Board</h3>
        <textarea
          className="mt-3 min-h-24 w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2"
          placeholder="Question text"
          value={questionText}
          onChange={(event) => setQuestionText(event.target.value)}
        />
        {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
        <button
          className="mt-4 rounded-xl bg-[color:var(--secondary)] px-4 py-2 text-sm text-[color:var(--secondary-foreground)]"
          disabled={pending}
          type="submit"
        >
          {pending ? "Adding..." : "Add Board"}
        </button>
      </form>
    </div>
  );
}
