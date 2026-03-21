import type { RunBoard, SessionSummary } from "@/types/sessions";

export function BoardNavigator({
  boards,
  session,
}: {
  boards: RunBoard[];
  session: SessionSummary | null;
}) {
  return (
    <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)] p-4">
      <div className="text-sm text-[color:var(--muted-foreground)]">
        Current board: {session?.currentBoardId ?? "None"}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {boards.map((board) => (
          <span
            key={board.id}
            className="rounded-full border border-[color:var(--border)] px-3 py-1 text-sm"
          >
            {board.sortOrder}
          </span>
        ))}
      </div>
    </div>
  );
}
