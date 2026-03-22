import type { CSSProperties } from "react";

import type { DisplayBoard, DisplayPayload } from "@/types/display";

export function QuestionOverlay({
  board,
}: {
  payload: DisplayPayload;
  board: DisplayBoard;
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center text-center">
      <div>
        <p
          className="text-sm uppercase tracking-[0.3em]"
          style={{ color: "var(--display-secondary)" } as CSSProperties}
        >
          Question
        </p>
        <h1 className="mt-4 max-w-5xl text-6xl font-bold">{board.questionText}</h1>
      </div>
    </div>
  );
}
