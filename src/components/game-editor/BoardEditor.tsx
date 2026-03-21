"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { createAnswer, softDeleteAnswer } from "@/actions/answers";
import { softDeleteBoard, updateBoard } from "@/actions/boards";
import type { GameBoardDetail } from "@/types/games";

import { AnswerRowEditor } from "./AnswerRowEditor";

export function BoardEditor({
  board,
  gameId,
}: {
  board: GameBoardDetail;
  gameId: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [questionText, setQuestionText] = useState(board.questionText);
  const [newAnswerText, setNewAnswerText] = useState("");
  const [newPointValue, setNewPointValue] = useState("0");
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)] p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <label className="grid gap-2">
            <span className="text-sm font-medium">Question</span>
            <textarea
              className="min-h-24 w-full rounded-xl border border-[color:var(--border)] bg-white px-3 py-2"
              value={questionText}
              onChange={(event) => setQuestionText(event.target.value)}
            />
          </label>
        </div>
        <div className="flex gap-2">
          <button
            className="rounded-xl border border-[color:var(--border)] px-3 py-2 text-sm"
            disabled={pending}
            onClick={() => {
              startTransition(async () => {
                try {
                  setError(null);
                  await updateBoard({ boardId: board.id, gameId, questionText });
                  router.refresh();
                } catch (caughtError) {
                  setError(caughtError instanceof Error ? caughtError.message : "Unable to save board.");
                }
              });
            }}
            type="button"
          >
            Save Board
          </button>
          <button
            className="rounded-xl border border-red-300 px-3 py-2 text-sm text-red-700"
            disabled={pending}
            onClick={() => {
              startTransition(async () => {
                try {
                  setError(null);
                  await softDeleteBoard({ boardId: board.id, gameId });
                  router.refresh();
                } catch (caughtError) {
                  setError(caughtError instanceof Error ? caughtError.message : "Unable to delete board.");
                }
              });
            }}
            type="button"
          >
            Delete Board
          </button>
        </div>
      </div>
      <div className="mt-4 space-y-3">
        {board.answers.map((answer) => (
          <AnswerRowEditor
            key={answer.id}
            answer={answer}
            gameId={gameId}
            boardId={board.id}
            onDelete={async (answerId) => {
              await softDeleteAnswer({ gameId, answerId });
            }}
          />
        ))}
      </div>
      <form
        className="mt-4 grid gap-3 rounded-2xl border border-dashed border-[color:var(--border)] bg-white/40 p-4 md:grid-cols-[1fr_120px_auto]"
        onSubmit={(event) => {
          event.preventDefault();
          startTransition(async () => {
            try {
              setError(null);
              await createAnswer({
                gameId,
                boardId: board.id,
                answerText: newAnswerText,
                pointValue: Number(newPointValue),
                displayPosition: board.answers.length + 1,
                sortOrder: board.answers.length + 1,
              });
              setNewAnswerText("");
              setNewPointValue("0");
              router.refresh();
            } catch (caughtError) {
              setError(caughtError instanceof Error ? caughtError.message : "Unable to add answer.");
            }
          });
        }}
      >
        <input
          className="rounded-xl border border-[color:var(--border)] bg-white px-3 py-2"
          placeholder="New answer"
          value={newAnswerText}
          onChange={(event) => setNewAnswerText(event.target.value)}
        />
        <input
          className="rounded-xl border border-[color:var(--border)] bg-white px-3 py-2"
          min="0"
          type="number"
          value={newPointValue}
          onChange={(event) => setNewPointValue(event.target.value)}
        />
        <button
          className="rounded-xl bg-[color:var(--secondary)] px-4 py-2 text-sm text-[color:var(--secondary-foreground)]"
          disabled={pending || board.answers.length >= 8}
          type="submit"
        >
          Add Answer
        </button>
      </form>
      {board.answers.length >= 8 ? (
        <p className="mt-3 text-sm text-[color:var(--muted-foreground)]">
          This board is at the current MVP limit of 8 answers.
        </p>
      ) : null}
      {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
