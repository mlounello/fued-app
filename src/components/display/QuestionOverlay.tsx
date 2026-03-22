import type { CSSProperties } from "react";

import type { DisplayBoard, DisplayPayload } from "@/types/display";

export function QuestionOverlay({
  board,
}: {
  payload: DisplayPayload;
  board: DisplayBoard;
}) {
  return (
    <div className="flex min-h-[calc(100vh-2rem)] items-center justify-center text-center">
      <div>
        <p
          className="text-[clamp(0.95rem,1.2vw,1.25rem)] font-bold uppercase tracking-[0.45em]"
          style={{ color: "var(--display-secondary)" } as CSSProperties}
        >
          Question
        </p>
        <h1 className="mt-5 max-w-[18ch] text-balance text-[clamp(3rem,7vw,6.8rem)] font-black leading-[0.95]">
          {board.questionText}
        </h1>
      </div>
    </div>
  );
}
