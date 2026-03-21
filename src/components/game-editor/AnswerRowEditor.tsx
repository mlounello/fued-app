"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { updateAnswer } from "@/actions/answers";
import type { AnswerItem } from "@/types/games";

export function AnswerRowEditor({
  answer,
  gameId,
  boardId,
  onDelete,
}: {
  answer: AnswerItem;
  gameId: string;
  boardId: string;
  onDelete: (answerId: string) => Promise<void>;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [answerText, setAnswerText] = useState(answer.answerText);
  const [pointValue, setPointValue] = useState(String(answer.pointValue));
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="grid gap-3 rounded-2xl border border-[color:var(--border)] bg-white/70 px-4 py-3 md:grid-cols-[60px_1fr_120px_auto_auto] md:items-center">
      <span className="text-sm font-medium">{answer.displayPosition}</span>
      <input
        className="rounded-xl border border-[color:var(--border)] bg-white px-3 py-2"
        value={answerText}
        onChange={(event) => setAnswerText(event.target.value)}
      />
      <input
        className="rounded-xl border border-[color:var(--border)] bg-white px-3 py-2"
        min="0"
        type="number"
        value={pointValue}
        onChange={(event) => setPointValue(event.target.value)}
      />
      <button
        className="rounded-xl border border-[color:var(--border)] px-3 py-2 text-sm"
        disabled={pending}
        onClick={() => {
          startTransition(async () => {
            try {
              setError(null);
              await updateAnswer({
                gameId,
                answerId: answer.id,
                boardId,
                answerText,
                pointValue: Number(pointValue),
                displayPosition: answer.displayPosition,
                sortOrder: answer.sortOrder,
              });
              router.refresh();
            } catch (caughtError) {
              setError(caughtError instanceof Error ? caughtError.message : "Unable to save answer.");
            }
          });
        }}
        type="button"
      >
        Save
      </button>
      <button
        className="rounded-xl border border-red-300 px-3 py-2 text-sm text-red-700"
        disabled={pending}
        onClick={() => {
          startTransition(async () => {
            try {
              setError(null);
              await onDelete(answer.id);
              router.refresh();
            } catch (caughtError) {
              setError(caughtError instanceof Error ? caughtError.message : "Unable to delete answer.");
            }
          });
        }}
        type="button"
      >
        Delete
      </button>
      {error ? (
        <p className="text-sm text-red-700 md:col-span-5">{error}</p>
      ) : null}
    </div>
  );
}
