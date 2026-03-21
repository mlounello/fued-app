import type { DisplayBoard, DisplayPayload } from "@/types/display";

export function QuestionOverlay({
  board,
}: {
  payload: DisplayPayload;
  board: DisplayBoard;
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center text-center">
      <h1 className="max-w-5xl text-6xl font-bold">{board.questionText}</h1>
    </div>
  );
}
