import type { CSSProperties } from "react";

import type { DisplayPayload } from "@/types/display";

export function PregameScreen({ payload }: { payload: DisplayPayload }) {
  return (
    <div className="flex min-h-[calc(100vh-2rem)] items-center justify-center text-center">
      <div>
        <p
          className="text-[clamp(0.95rem,1.2vw,1.25rem)] font-bold uppercase tracking-[0.45em]"
          style={{ color: "var(--display-secondary)" } as CSSProperties}
        >
          Pregame
        </p>
        <h1 className="mt-5 text-balance text-[clamp(3.2rem,7vw,7rem)] font-black leading-[0.95]">
          {payload.game.title}
        </h1>
      </div>
    </div>
  );
}
