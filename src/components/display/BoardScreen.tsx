import type { CSSProperties } from "react";

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
    <div
      className="flex min-h-[calc(100vh-2rem)] flex-col justify-between rounded-[2rem] border-[6px] px-4 py-5 md:px-6 md:py-6 lg:px-8 lg:py-8"
      style={{ borderColor: "var(--display-secondary)" } as CSSProperties}
    >
      <div className="space-y-6 md:space-y-8">
        <div className="text-center">
          <p
            className="text-[clamp(0.9rem,1.2vw,1.3rem)] font-bold uppercase tracking-[0.45em]"
            style={{ color: "var(--display-secondary)" } as CSSProperties}
          >
            Board
          </p>
          <h1 className="mx-auto mt-3 max-w-[18ch] text-balance text-[clamp(2.6rem,5.6vw,5.9rem)] font-black leading-[0.95]">
            {board.questionText}
          </h1>
        </div>

        <div className="grid gap-3 md:grid-cols-2 md:gap-4 lg:gap-5">
          {board.answers.map((answer) => (
            <AnswerTile key={answer.id} answer={answer} />
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:mt-6 md:grid-cols-[1fr_auto] md:gap-4 lg:mt-8 lg:gap-5">
        <ScoreDisplay payload={payload} />
        <StrikeDisplay count={payload.state.strikesCount} />
      </div>
    </div>
  );
}
