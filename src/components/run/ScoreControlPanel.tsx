import type { RunScreenData } from "@/types/sessions";

export function ScoreControlPanel({
  game,
  session,
}: {
  game: RunScreenData["game"];
  session: RunScreenData["session"];
}) {
  return (
    <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)] p-6">
      <h2 className="font-semibold">Scores</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-white/70 p-4">
          <div className="text-sm text-[color:var(--muted-foreground)]">{game.team1Name}</div>
          <div className="text-3xl font-bold">{session?.score1 ?? 0}</div>
        </div>
        <div className="rounded-2xl bg-white/70 p-4">
          <div className="text-sm text-[color:var(--muted-foreground)]">{game.team2Name}</div>
          <div className="text-3xl font-bold">{session?.score2 ?? 0}</div>
        </div>
      </div>
    </div>
  );
}
