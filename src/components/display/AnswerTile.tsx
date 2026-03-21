import type { DisplayAnswer } from "@/types/display";

export function AnswerTile({ answer }: { answer: DisplayAnswer }) {
  return (
    <div
      className={`flex min-h-28 items-center justify-between rounded-2xl px-5 py-4 transition-all duration-500 ${
        answer.isRevealed
          ? "scale-[1.02] bg-[rgba(247,201,72,0.18)] shadow-[0_0_0_1px_rgba(247,201,72,0.35)]"
          : "bg-black/20"
      }`}
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
