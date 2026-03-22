import type { CSSProperties } from "react";

import type { DisplayAnswer } from "@/types/display";

export function AnswerTile({ answer }: { answer: DisplayAnswer }) {
  return (
    <div
      className="flex min-h-28 items-center justify-between rounded-2xl border px-5 py-4"
      style={
        {
          backgroundColor: "var(--display-primary)",
          borderColor: "var(--display-secondary)",
          color: "var(--display-accent)",
        } as CSSProperties
      }
    >
      <span
        className="text-xl font-bold"
        style={{ color: "var(--display-secondary)" } as CSSProperties}
      >
        {answer.displayPosition}
      </span>
      <span className="text-center text-2xl font-semibold">
        {answer.answerText ?? "........"}
      </span>
      <span
        className="text-xl font-bold"
        style={{ color: "var(--display-secondary)" } as CSSProperties}
      >
        {answer.isRevealed ? answer.pointValue : ""}
      </span>
    </div>
  );
}
