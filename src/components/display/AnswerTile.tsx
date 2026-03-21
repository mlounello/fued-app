import type { DisplayAnswer } from "@/types/display";

export function AnswerTile({ answer }: { answer: DisplayAnswer }) {
  return (
    <div className="flex min-h-28 items-center justify-between rounded-2xl bg-black/20 px-5 py-4">
      <span className="text-xl font-bold">{answer.displayPosition}</span>
      <span className="text-center text-2xl font-semibold">
        {answer.answerText ?? "........"}
      </span>
      <span className="text-xl font-bold">
        {answer.isRevealed ? answer.pointValue : ""}
      </span>
    </div>
  );
}
