import type { CSSProperties } from "react";

import { DisplayShell } from "@/components/display/DisplayShell";
import { resolveDisplayTheme } from "@/lib/utils/display-theme";
import type { DisplayPayload } from "@/types/display";

export function LiveDisplayPreview({
  gameTitle,
  payload,
}: {
  gameTitle: string;
  payload: DisplayPayload | null;
}) {
  if (!payload) {
    return (
      <div className="rounded-[2rem] border border-[color:var(--border)] bg-[#101827] p-6 text-white">
        <div className="text-sm uppercase tracking-[0.3em] text-yellow-300">
          Audience Preview
        </div>
        <h2 className="mt-4 text-4xl font-bold">{gameTitle}</h2>
        <p className="mt-3 text-sm text-slate-300">
          Launch a session to preview the public display.
        </p>
      </div>
    );
  }

  const theme = resolveDisplayTheme({
    brandPrimaryColor: payload.game.brandPrimaryColor,
    brandSecondaryColor: payload.game.brandSecondaryColor,
    brandAccentColor: payload.game.brandAccentColor,
    brandBackgroundColor: payload.game.brandBackgroundColor,
  });

  return (
    <div
      className="overflow-hidden rounded-[2rem] border shadow-[0_20px_70px_rgba(0,0,0,0.18)]"
      style={
        {
          backgroundColor: theme.background,
          borderColor: theme.secondary,
          color: theme.accent,
        } as CSSProperties
      }
    >
      <div
        className="border-b px-6 py-4"
        style={
          {
            backgroundColor: theme.primary,
            borderColor: theme.secondary,
            color: theme.accent,
          } as CSSProperties
        }
      >
        <div
          className="text-sm uppercase tracking-[0.3em]"
          style={{ color: theme.secondary } as CSSProperties}
        >
          Audience Preview
        </div>
      </div>
      <div
        className="origin-top-left scale-[0.82] overflow-hidden"
        style={{ width: "121.95%" }}
      >
        <DisplayShell payload={payload} embedded />
      </div>
    </div>
  );
}
