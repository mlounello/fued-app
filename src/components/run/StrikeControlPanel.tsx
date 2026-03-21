import type { SessionSummary } from "@/types/sessions";

export function StrikeControlPanel({
  session,
}: {
  session: SessionSummary | null;
}) {
  return (
    <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)] p-6">
      <h2 className="font-semibold">Strikes</h2>
      <div className="mt-2 text-3xl font-bold">{session?.strikesCount ?? 0}</div>
    </div>
  );
}
