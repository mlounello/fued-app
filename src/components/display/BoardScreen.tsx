"use client";

import { useEffect, useState } from "react";
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
  const [questionPhase, setQuestionPhase] = useState<"hidden" | "visible">("hidden");

  useEffect(() => {
    setQuestionPhase("hidden");

    const frame = requestAnimationFrame(() => {
      setQuestionPhase("visible");
    });

    return () => cancelAnimationFrame(frame);
  }, [board.id, board.questionText, payload.state.currentScreen]);

  return (
    <div
      className="flex h-full min-h-0 flex-col justify-between rounded-[2rem] border-[6px] px-[clamp(0.75rem,1.5vw,1.5rem)] py-[clamp(0.75rem,1.5vh,1.5rem)]"
      style={{ borderColor: "var(--display-secondary)" } as CSSProperties}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-[clamp(0.5rem,1.2vh,1rem)]">
        <div className="text-center">
          <div
            className="mx-auto flex w-fit items-center justify-center rounded-full border-[4px] px-[clamp(0.8rem,1.4vw,1.35rem)] py-[clamp(0.22rem,0.45vh,0.45rem)]"
            style={{ borderColor: "var(--display-secondary)" } as CSSProperties}
          >
            <p
              className="text-[clamp(0.75rem,0.95vw,1.05rem)] font-bold uppercase tracking-[0.35em]"
              style={{ color: "var(--display-secondary)" } as CSSProperties}
            >
              Question
            </p>
          </div>
          <h1
            className="mx-auto mt-[clamp(0.65rem,1.2vh,1rem)] max-w-[18ch] text-balance text-[clamp(1.65rem,min(3.5vw,4vh),4rem)] font-black leading-[0.92]"
            style={
              {
                transition:
                  "transform 380ms cubic-bezier(0.16, 1, 0.3, 1), opacity 300ms ease, filter 300ms ease",
                transform:
                  questionPhase === "visible"
                    ? "translateY(0) scale(1)"
                    : "translateY(-3vh) scale(0.22)",
                transformOrigin: "top center",
                opacity: questionPhase === "visible" ? 1 : 0.12,
                filter: questionPhase === "visible" ? "blur(0)" : "blur(6px)",
              } as CSSProperties
            }
          >
            {board.questionText}
          </h1>
        </div>

        <div className="grid min-h-0 flex-1 auto-rows-fr gap-[clamp(0.45rem,1vh,0.9rem)] md:grid-cols-2">
          {board.answers.map((answer) => (
            <AnswerTile key={answer.id} answer={answer} />
          ))}
        </div>
      </div>

      <div className="mt-[clamp(0.5rem,1.2vh,1rem)] grid gap-[clamp(0.45rem,1vh,0.9rem)] md:grid-cols-[1fr_auto]">
        <ScoreDisplay payload={payload} />
        {payload.state.showStrikesBar ? (
          <StrikeDisplay count={payload.state.strikesCount} />
        ) : null}
      </div>
    </div>
  );
}
