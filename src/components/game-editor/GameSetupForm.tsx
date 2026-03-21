import type { GameSettings } from "@/types/games";

export function GameSetupForm({ game }: { game: GameSettings }) {
  return (
    <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)] p-6">
      <h2 className="text-xl font-semibold">Game Setup</h2>
      <p className="mt-2 text-sm text-[color:var(--muted-foreground)]">
        {game.title}
      </p>
    </div>
  );
}
