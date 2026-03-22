import type { DisplayPayload } from "@/types/display";

export function PregameScreen({ payload }: { payload: DisplayPayload }) {
  const hasVisual = Boolean(payload.assets.pregameImage?.url);
  const frameStyle = {
    width: "min(90vw, calc((100vh - 11rem) * 16 / 9))",
    maxHeight: "calc(100vh - 11rem)",
  };

  return (
    <div className="flex h-full min-h-0 items-center justify-center">
      <div className="flex w-full max-w-[min(92vw,1700px)] flex-col items-center justify-center">
        {payload.assets.logo?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt={`${payload.game.title} logo`}
            className="mx-auto mb-[clamp(0.75rem,1.6vh,1.5rem)] max-h-[10vh] max-w-[18vw] object-contain"
            src={payload.assets.logo.url}
          />
        ) : null}

        <div className="mx-auto w-full" style={frameStyle}>
          <div className="relative aspect-video overflow-hidden rounded-[2rem] border-[6px] border-[color:var(--display-secondary)] bg-[color:var(--display-primary)] shadow-[0_28px_80px_rgba(0,0,0,0.28)]">
            {payload.assets.pregameImage?.url ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={`${payload.game.title} pregame`}
                  className="h-full w-full object-cover"
                  src={payload.assets.pregameImage.url}
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.12)_0%,rgba(0,0,0,0.08)_34%,rgba(0,0,0,0.58)_100%)]" />
              </>
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_45%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(0,0,0,0.18))]" />
            )}

            {payload.state.showGameTitle ? (
              <div className="absolute inset-x-[clamp(1rem,3vw,3rem)] bottom-[clamp(1rem,4vh,3rem)] text-center">
                <h1 className="text-balance text-[clamp(2.4rem,min(5vw,6vh),5.4rem)] font-black leading-[0.92] text-[color:var(--display-accent)] drop-shadow-[0_4px_14px_rgba(0,0,0,0.45)]">
                  {payload.game.title}
                </h1>
              </div>
            ) : null}
          </div>
        </div>

        {!hasVisual && !payload.state.showGameTitle ? (
          <div className="mt-[clamp(1rem,2.2vh,1.75rem)] text-center text-[clamp(1rem,1.5vw,1.4rem)] font-bold uppercase tracking-[0.28em] text-[color:var(--display-secondary)]">
            Ready to begin
          </div>
        ) : null}
      </div>
    </div>
  );
}
