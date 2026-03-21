import type { DisplayPayload } from "@/types/display";

export function ScoreDisplay({ payload }: { payload: DisplayPayload }) {
  if (!payload.game.showScores) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl bg-black/20 p-4">
        <div className="text-sm text-slate-300">{payload.game.team1Name}</div>
        <div className="text-4xl font-bold">{payload.state.score1}</div>
      </div>
      <div className="rounded-2xl bg-black/20 p-4">
        <div className="text-sm text-slate-300">{payload.game.team2Name}</div>
        <div className="text-4xl font-bold">{payload.state.score2}</div>
      </div>
    </div>
  );
}
