import type { CSSProperties } from "react";

import type { DisplayPayload } from "@/types/display";

export function ScoreDisplay({ payload }: { payload: DisplayPayload }) {
  if (!payload.game.showScores) {
    return null;
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 md:gap-4 lg:gap-5">
      <div
        className="rounded-[1.4rem] border-[4px] px-4 py-3 md:px-5 md:py-4"
        style={
          {
            backgroundColor: "var(--display-primary)",
            borderColor: "var(--display-secondary)",
            color: "var(--display-accent)",
          } as CSSProperties
        }
      >
        <div
          className="text-[clamp(0.95rem,1.1vw,1.2rem)] font-bold uppercase tracking-[0.18em]"
          style={{ color: "var(--display-secondary)" } as CSSProperties}
        >
          {payload.game.team1Name}
        </div>
        <div className="mt-2 text-[clamp(3.2rem,6.8vw,6rem)] font-black leading-none">
          {payload.state.score1}
        </div>
      </div>
      <div
        className="rounded-[1.4rem] border-[4px] px-4 py-3 md:px-5 md:py-4"
        style={
          {
            backgroundColor: "var(--display-primary)",
            borderColor: "var(--display-secondary)",
            color: "var(--display-accent)",
          } as CSSProperties
        }
      >
        <div
          className="text-[clamp(0.95rem,1.1vw,1.2rem)] font-bold uppercase tracking-[0.18em]"
          style={{ color: "var(--display-secondary)" } as CSSProperties}
        >
          {payload.game.team2Name}
        </div>
        <div className="mt-2 text-[clamp(3.2rem,6.8vw,6rem)] font-black leading-none">
          {payload.state.score2}
        </div>
      </div>
    </div>
  );
}
