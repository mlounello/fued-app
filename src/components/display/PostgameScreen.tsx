import type { CSSProperties } from "react";

import type { DisplayPayload } from "@/types/display";

export function PostgameScreen({ payload }: { payload: DisplayPayload }) {
  return (
    <div className="flex min-h-[calc(100vh-2rem)] items-center justify-center text-center">
      <div className="max-w-[min(82vw,1200px)]">
        {payload.assets.logo?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt={`${payload.game.title} logo`}
            className="mx-auto mb-6 max-h-[14vh] max-w-[24vw] object-contain"
            src={payload.assets.logo.url}
          />
        ) : null}
        {payload.assets.postgameImage?.url ? (
          <div className="mx-auto mb-6 overflow-hidden rounded-[1.5rem] border-[4px] border-[color:var(--display-secondary)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={`${payload.game.title} postgame`}
              className="max-h-[42vh] w-full object-cover"
              src={payload.assets.postgameImage.url}
            />
          </div>
        ) : null}
        <p
          className="text-[clamp(0.95rem,1.2vw,1.25rem)] font-bold uppercase tracking-[0.45em]"
          style={{ color: "var(--display-secondary)" } as CSSProperties}
        >
          Thanks for playing
        </p>
        <h1 className="mt-5 text-balance text-[clamp(3.2rem,7vw,7rem)] font-black leading-[0.95]">
          {payload.game.title}
        </h1>
      </div>
    </div>
  );
}
