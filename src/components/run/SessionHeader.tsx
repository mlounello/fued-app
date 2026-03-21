import type { RunScreenData } from "@/types/sessions";

import { DisplayLinkPanel } from "./DisplayLinkPanel";

export function SessionHeader({
  game,
  session,
}: {
  game: RunScreenData["game"];
  session: RunScreenData["session"];
}) {
  return (
    <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{game.title}</h1>
          <p className="mt-1 text-sm text-[color:var(--muted-foreground)]">
            {session ? `Session is ${session.sessionStatus}` : "No live session yet"}
          </p>
        </div>
        <DisplayLinkPanel token={session?.publicToken ?? null} />
      </div>
    </div>
  );
}
