import type { SessionSummary } from "@/types/sessions";

export function RunScreenModeControls({
  session,
}: {
  session: SessionSummary | null;
}) {
  return (
    <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)] p-4 text-sm">
      Current screen: {session?.currentScreen ?? "pregame"}
    </div>
  );
}
