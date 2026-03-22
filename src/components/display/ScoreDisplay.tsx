import type { CSSProperties } from "react";

import type { DisplayPayload } from "@/types/display";

export function ScoreDisplay({ payload }: { payload: DisplayPayload }) {
  if (!payload.game.showScores) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div
        className="rounded-2xl border p-4"
        style={
          {
            backgroundColor: "var(--display-primary)",
            borderColor: "var(--display-secondary)",
            color: "var(--display-accent)",
          } as CSSProperties
        }
      >
        <div
          className="text-sm"
          style={{ color: "var(--display-secondary)" } as CSSProperties}
        >
          {payload.game.team1Name}
        </div>
        <div className="text-4xl font-bold">{payload.state.score1}</div>
      </div>
      <div
        className="rounded-2xl border p-4"
        style={
          {
            backgroundColor: "var(--display-primary)",
            borderColor: "var(--display-secondary)",
            color: "var(--display-accent)",
          } as CSSProperties
        }
      >
        <div
          className="text-sm"
          style={{ color: "var(--display-secondary)" } as CSSProperties}
        >
          {payload.game.team2Name}
        </div>
        <div className="text-4xl font-bold">{payload.state.score2}</div>
      </div>
    </div>
  );
}
