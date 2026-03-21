import type { CSSProperties } from "react";

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

  const background = payload.game.brandBackgroundColor ?? "#111827";
  const primary = payload.game.brandPrimaryColor ?? "#006b54";
  const secondary = payload.game.brandSecondaryColor ?? "#FCC917";
  const accent = payload.game.brandAccentColor ?? "#FFFFFF";

  return (
    <div
      className={
        embedded
          ? "min-h-full border p-8"
          : "min-h-screen w-full border-0 px-10 py-12"
      }
      style={
        {
          backgroundColor: background,
          color: accent,
          borderColor: secondary,
          borderRadius: embedded ? "2rem" : "0",
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
