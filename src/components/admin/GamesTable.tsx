import type { AdminGameRow } from "@/types/admin";

export function GamesTable({ games }: { games: AdminGameRow[] }) {
  return (
    <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)] p-4">
      <div className="grid gap-3">
        {games.map((game) => (
          <div key={game.id} className="rounded-2xl border border-[color:var(--border)] bg-white/70 p-4">
            <div className="font-medium">{game.title}</div>
            <div className="text-sm text-[color:var(--muted-foreground)]">{game.ownerEmail}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
