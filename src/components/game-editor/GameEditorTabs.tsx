"use client";

import { useState } from "react";

import type { GameBoardDetail, GameSettings } from "@/types/games";

import { BoardList } from "./BoardList";
import { GameSetupForm } from "./GameSetupForm";

type TabKey = "setup" | "boards" | "assets";

export function GameEditorTabs({
  game,
  boards,
}: {
  game: GameSettings;
  boards: GameBoardDetail[];
}) {
  const [tab, setTab] = useState<TabKey>("setup");

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <button
          onClick={() => setTab("setup")}
          className="rounded-xl border border-[color:var(--border)] px-3 py-2"
          type="button"
        >
          Setup
        </button>
        <button
          onClick={() => setTab("boards")}
          className="rounded-xl border border-[color:var(--border)] px-3 py-2"
          type="button"
        >
          Boards
        </button>
        <button
          onClick={() => setTab("assets")}
          className="rounded-xl border border-[color:var(--border)] px-3 py-2"
          type="button"
        >
          Assets
        </button>
      </div>

      {tab === "setup" ? <GameSetupForm game={game} /> : null}
      {tab === "boards" ? <BoardList boards={boards} gameId={game.id} /> : null}
      {tab === "assets" ? <div>Assets UI goes here.</div> : null}
    </div>
  );
}
