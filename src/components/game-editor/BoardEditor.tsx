import type { GameBoardDetail } from "@/types/games";

import { AnswerRowEditor } from "./AnswerRowEditor";

export function BoardEditor({ board }: { board: GameBoardDetail }) {
  return (
    <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)] p-6">
      <h3 className="font-semibold">{board.questionText}</h3>
      <div className="mt-4 space-y-3">
        {board.answers.map((answer) => (
          <AnswerRowEditor key={answer.id} answer={answer} />
        ))}
      </div>
    </div>
  );
}
