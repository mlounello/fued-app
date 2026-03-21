import type { RunBoard, SessionSummary } from "@/types/sessions";

import { RevealActionButtonGroup } from "./RevealActionButtonGroup";

export function AnswerRevealPanel({
  boards,
  session,
}: {
  boards: RunBoard[];
  session: SessionSummary | null;
}) {
  const currentBoard = boards.find((board) => board.id === session?.currentBoardId) ?? boards[0];

  if (!currentBoard || !session) {
    return (
      <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)] p-6">
        Launch a session to reveal answers.
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)] p-6">
      <h2 className="font-semibold">{currentBoard.questionText}</h2>
      <div className="mt-4 space-y-3">
        {currentBoard.answers.map((answer) => (
          <div
            key={answer.id}
            className="rounded-2xl border border-[color:var(--border)] bg-white/70 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="font-medium">
                  {answer.displayPosition}. {answer.answerText}
                </div>
                <div className="text-sm text-[color:var(--muted-foreground)]">
                  {answer.pointValue} points
                </div>
              </div>
              {answer.isRevealed ? (
                <span className="text-sm font-medium text-green-700">Revealed</span>
              ) : (
                <RevealActionButtonGroup
                  sessionId={session.sessionId}
                  answerId={answer.id}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
