import type { DisplayBoard, DisplayPayload } from "@/types/display";

import { AnswerTile } from "./AnswerTile";
import { ScoreDisplay } from "./ScoreDisplay";
import { StrikeDisplay } from "./StrikeDisplay";

export function BoardScreen({
  payload,
  board,
}: {
  payload: DisplayPayload;
  board: DisplayBoard;
}) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-yellow-300">
          Board
        </p>
        <h1 className="mt-4 text-5xl font-bold">{board.questionText}</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {board.answers.map((answer) => (
          <AnswerTile key={answer.id} answer={answer} />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_auto]">
        <ScoreDisplay payload={payload} />
        <StrikeDisplay count={payload.state.strikesCount} />
      </div>
    </div>
  );
}
