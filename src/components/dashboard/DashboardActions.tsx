import { createGame } from "@/actions/games";

export function DashboardActions() {
  return (
    <form action={createGame}>
      <button
        className="rounded-xl bg-[color:var(--secondary)] px-4 py-2 text-sm text-[color:var(--secondary-foreground)]"
        type="submit"
      >
        Create New Game
      </button>
    </form>
  );
}
