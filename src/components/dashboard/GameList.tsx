import Link from "next/link";

import type { GameSummary } from "@/types/games";

export function GameList({ games }: { games: GameSummary[] }) {
  if (!games.length) {
    return (
      <div className="rounded-3xl border border-dashed border-[color:var(--border)] bg-[color:var(--card)] p-8">
        No games yet.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {games.map((game) => (
        <div
          key={game.id}
          className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)] p-5"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-lg font-semibold">{game.title}</div>
              <div className="text-sm text-[color:var(--muted-foreground)]">
                {game.boardCount} boards
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                className="rounded-xl border border-[color:var(--border)] px-3 py-2 text-sm"
                href={`/games/${game.id}/edit`}
              >
                Edit
              </Link>
              <Link
                className="rounded-xl bg-[color:var(--secondary)] px-3 py-2 text-sm text-[color:var(--secondary-foreground)]"
                href={`/games/${game.id}/run`}
              >
                Run
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
