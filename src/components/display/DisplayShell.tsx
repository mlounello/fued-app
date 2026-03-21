import type { CSSProperties } from "react";

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

  const background = payload.game.brandBackgroundColor ?? "#111827";
  const primary = payload.game.brandPrimaryColor ?? "#006b54";
  const secondary = payload.game.brandSecondaryColor ?? "#FCC917";
  const accent = payload.game.brandAccentColor ?? "#FFFFFF";

  return (
    <div
      className="min-h-[calc(100vh-8rem)] rounded-[2rem] border p-8"
      style={
        {
          backgroundColor: background,
          color: accent,
          borderColor: secondary,
          "--display-background": background,
          "--display-primary": primary,
          "--display-secondary": secondary,
          "--display-accent": accent,
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
