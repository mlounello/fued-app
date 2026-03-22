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

  return (
    <div
      className="min-h-[calc(100vh-8rem)] rounded-[2rem] p-8 text-white"
      style={{ backgroundColor: payload.game.brandSecondaryColor }}
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
