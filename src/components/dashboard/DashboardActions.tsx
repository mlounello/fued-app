import Link from "next/link";

export function DashboardActions() {
  return (
    <div className="flex gap-3">
      <Link className="rounded-xl border px-3 py-2" href="/games/new">
        Create New Game
      </Link>
    </div>
  );
}
