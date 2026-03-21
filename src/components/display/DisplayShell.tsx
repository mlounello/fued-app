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

  const style = {
    backgroundColor:
      payload.game.brandBackgroundColor ?? payload.game.brandSecondaryColor,
    color: payload.game.brandAccentColor ?? "#ffffff",
    "--display-primary": payload.game.brandPrimaryColor,
    "--display-secondary": payload.game.brandSecondaryColor,
    "--display-accent": payload.game.brandAccentColor ?? "#ffffff",
    "--display-background":
      payload.game.brandBackgroundColor ?? payload.game.brandSecondaryColor,
  } as CSSProperties;

  return (
    <div
      className="min-h-[calc(100vh-8rem)] rounded-[2rem] border p-8"
      style={{
        ...style,
        borderColor: "color-mix(in srgb, var(--display-secondary) 35%, transparent)",
      }}
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
