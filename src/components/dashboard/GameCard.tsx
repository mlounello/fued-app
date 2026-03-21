import type { GameSummary } from "@/types/games";

export function GameCard({ game }: { game: GameSummary }) {
  return (
    <div className="rounded-2xl border border-[color:var(--border)] p-4">
      <div className="font-semibold">{game.title}</div>
    </div>
  );
}
