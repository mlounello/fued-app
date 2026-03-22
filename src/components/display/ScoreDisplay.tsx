import type { CSSProperties } from "react";

import type { DisplayPayload } from "@/types/display";

export function ScoreDisplay({ payload }: { payload: DisplayPayload }) {
  if (!payload.game.showScores) {
    return null;
  }

  return (
    <div className="grid gap-[clamp(0.45rem,1vh,0.9rem)] md:grid-cols-2">
      <div
        className="rounded-[1.2rem] border-[4px] px-[clamp(0.75rem,1.2vw,1.1rem)] py-[clamp(0.55rem,1vh,0.9rem)]"
        style={
          {
            backgroundColor: "var(--display-primary)",
            borderColor: "var(--display-secondary)",
            color: "var(--display-accent)",
          } as CSSProperties
        }
      >
        <div
          className="text-[clamp(0.72rem,0.9vw,0.95rem)] font-bold uppercase tracking-[0.14em]"
          style={{ color: "var(--display-secondary)" } as CSSProperties}
        >
          {payload.game.team1Name}
        </div>
        <div className="mt-[clamp(0.15rem,0.4vh,0.35rem)] text-[clamp(2rem,min(4.6vw,5vh),4.6rem)] font-black leading-none">
          {payload.state.score1}
        </div>
      </div>
      <div
        className="rounded-[1.2rem] border-[4px] px-[clamp(0.75rem,1.2vw,1.1rem)] py-[clamp(0.55rem,1vh,0.9rem)]"
        style={
          {
            backgroundColor: "var(--display-primary)",
            borderColor: "var(--display-secondary)",
            color: "var(--display-accent)",
          } as CSSProperties
        }
      >
        <div
          className="text-[clamp(0.72rem,0.9vw,0.95rem)] font-bold uppercase tracking-[0.14em]"
          style={{ color: "var(--display-secondary)" } as CSSProperties}
        >
          {payload.game.team2Name}
        </div>
        <div className="mt-[clamp(0.15rem,0.4vh,0.35rem)] text-[clamp(2rem,min(4.6vw,5vh),4.6rem)] font-black leading-none">
          {payload.state.score2}
        </div>
      </div>
    </div>
  );
}
