import type { GameBoardDetail } from "@/types/games";

import { BoardEditor } from "./BoardEditor";

export function BoardList({
  boards,
}: {
  boards: GameBoardDetail[];
  gameId: string;
}) {
  return (
    <div className="space-y-4">
      {boards.map((board) => (
        <BoardEditor key={board.id} board={board} />
      ))}
    </div>
  );
}
