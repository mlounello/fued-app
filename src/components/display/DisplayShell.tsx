import type { CSSProperties } from "react";

import { resolveDisplayTheme } from "@/lib/utils/display-theme";
import type { DisplayPayload } from "@/types/display";

import { BoardScreen } from "./BoardScreen";
import { PostgameScreen } from "./PostgameScreen";
import { PregameScreen } from "./PregameScreen";
import { QuestionOverlay } from "./QuestionOverlay";

export function DisplayShell({
  payload,
  embedded = false,
}: {
  payload: DisplayPayload;
  embedded?: boolean;
}) {
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
      className={
        embedded
          ? "min-h-full border p-8"
          : "min-h-screen w-full border-0 px-10 py-12"
      }
      style={
        {
          backgroundColor: theme.background,
          color: theme.accent,
          borderColor: theme.secondary,
          borderRadius: embedded ? "2rem" : "0",
          "--display-background": theme.background,
          "--display-primary": theme.primary,
          "--display-secondary": theme.secondary,
          "--display-accent": theme.accent,
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
