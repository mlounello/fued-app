import type { CSSProperties } from "react";

import type { DisplayAnswer } from "@/types/display";

export function AnswerTile({ answer }: { answer: DisplayAnswer }) {
  return (
    <div
      className="relative flex min-h-28 items-center justify-center rounded-[1.4rem] border-[4px] px-4 py-4 md:min-h-32 md:px-5 lg:min-h-36 lg:px-6"
      style={
        {
          backgroundColor: "var(--display-primary)",
          borderColor: "var(--display-secondary)",
          color: "var(--display-accent)",
        } as CSSProperties
      }
    >
      <span className="max-w-[calc(100%-5rem)] text-center text-[clamp(1.8rem,3.8vw,3.8rem)] font-black leading-[0.95] tracking-tight">
        {answer.answerText ?? "........"}
      </span>
      <span
        className="absolute right-3 top-1/2 -translate-y-1/2 text-right text-[clamp(1.5rem,3vw,3.2rem)] font-black leading-none md:right-4 lg:right-5"
        style={{ color: "var(--display-secondary)" } as CSSProperties}
      >
        {answer.isRevealed ? answer.pointValue : ""}
      </span>
    </div>
  );
}
