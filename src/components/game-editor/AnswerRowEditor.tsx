import type { AnswerItem } from "@/types/games";

export function AnswerRowEditor({ answer }: { answer: AnswerItem }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-[color:var(--border)] bg-white/70 px-4 py-3">
      <span>{answer.displayPosition}. {answer.answerText}</span>
      <span className="text-sm text-[color:var(--muted-foreground)]">
        {answer.pointValue} pts
      </span>
    </div>
  );
}
