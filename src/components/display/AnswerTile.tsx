import type { CSSProperties } from "react";

import type { DisplayAnswer } from "@/types/display";

export function AnswerTile({ answer }: { answer: DisplayAnswer }) {
  return (
    <div
      className="flex min-h-28 items-center justify-between rounded-2xl px-5 py-4 transition-all duration-500"
      style={{
        backgroundColor: answer.isRevealed
          ? "color-mix(in srgb, var(--display-secondary) 24%, transparent)"
          : "color-mix(in srgb, var(--display-primary) 72%, transparent)",
        boxShadow: answer.isRevealed
          ? "0 0 0 1px color-mix(in srgb, var(--display-secondary) 50%, transparent)"
          : "0 0 0 1px color-mix(in srgb, var(--display-primary) 35%, transparent)",
        color: "var(--display-accent)",
        transform: answer.isRevealed ? "scale(1.02)" : "scale(1)",
      } as CSSProperties}
    >
      <span className="text-xl font-bold">{answer.displayPosition}</span>
      <span
        className={`text-center text-2xl font-semibold transition-all duration-500 ${
          answer.isRevealed ? "translate-y-0 opacity-100" : "translate-y-1 opacity-70"
        }`}
      >
        {answer.answerText ?? "........"}
      </span>
      <span
        className={`text-xl font-bold transition-all duration-500 ${
          answer.isRevealed ? "opacity-100" : "opacity-0"
        }`}
      >
        {answer.isRevealed ? answer.pointValue : ""}
      </span>
    </div>
  );
}
