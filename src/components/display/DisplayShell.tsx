import type { CSSProperties } from "react";

import { resolveDisplayTheme } from "@/lib/utils/display-theme";
import type { DisplayPayload } from "@/types/display";

import { BoardScreen } from "./BoardScreen";
import { PostgameScreen } from "./PostgameScreen";
import { PregameScreen } from "./PregameScreen";
import { QuestionOverlay } from "./QuestionOverlay";

export function DisplayShell({ payload }: { payload: DisplayPayload }) {
  const board =
    payload.boards.find((item) => item.id === payload.state.currentBoardId) ??
    payload.boards[0] ??
    null;

  const theme = resolveDisplayTheme({
    brandPrimaryColor: payload.game.brandPrimaryColor,
    brandSecondaryColor: payload.game.brandSecondaryColor,
    brandAccentColor: payload.game.brandAccentColor,
    brandBackgroundColor: payload.game.brandBackgroundColor,
  });

  return (
    <div
      className="min-h-screen w-full px-3 py-3 text-white md:px-4 md:py-4 lg:px-5 lg:py-5"
      style={
        {
          backgroundColor: theme.background,
          color: theme.accent,
          "--display-primary": theme.primary,
          "--display-secondary": theme.secondary,
          "--display-accent": theme.accent,
          "--display-background": theme.background,
        } as CSSProperties
      }
    >
      {payload.state.currentScreen === "pregame" ? (
        <PregameScreen payload={payload} />
      ) : null}
      {payload.state.currentScreen === "board" && board ? (
        <BoardScreen payload={payload} board={board} />
      ) : null}
      {payload.state.currentScreen === "question_overlay" && board ? (
        <QuestionOverlay payload={payload} board={board} />
      ) : null}
      {payload.state.currentScreen === "postgame" ? (
        <PostgameScreen payload={payload} />
      ) : null}
    </div>
  );
}
