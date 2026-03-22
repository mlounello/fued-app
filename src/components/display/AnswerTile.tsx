import type { CSSProperties } from "react";

import type { DisplayAnswer } from "@/types/display";

export function AnswerTile({ answer }: { answer: DisplayAnswer }) {
  return (
    <div
      className="relative flex min-h-0 h-full items-center justify-center rounded-[1.2rem] border-[4px] px-[clamp(0.75rem,1.2vw,1.2rem)] py-[clamp(0.45rem,0.9vh,0.8rem)]"
      style={
        {
          backgroundColor: "var(--display-primary)",
          borderColor: "var(--display-secondary)",
          color: "var(--display-accent)",
        } as CSSProperties
      }
    >
      <span className="max-w-[calc(100%-4.25rem)] text-center text-[clamp(1.1rem,min(2.6vw,2.8vh),2.4rem)] font-black leading-[0.92] tracking-tight">
        {answer.answerText ?? "........"}
      </span>
      <span
        className="absolute right-[clamp(0.6rem,1vw,1rem)] top-1/2 -translate-y-1/2 text-right text-[clamp(1rem,min(2vw,2.2vh),2rem)] font-black leading-none"
        style={{ color: "var(--display-secondary)" } as CSSProperties}
      >
        {answer.isRevealed ? answer.pointValue : ""}
      </span>
    </div>
  );
}
