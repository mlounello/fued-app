import { launchOrResumeSessionFromOperator } from "@/actions/sessions";
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
        <div className="flex flex-col items-end gap-3">
          {!session ? (
            <form action={launchOrResumeSessionFromOperator.bind(null, game.id)}>
              <button
                className="rounded-xl bg-[color:var(--accent)] px-4 py-2 text-sm font-semibold text-[color:var(--accent-foreground)]"
                type="submit"
              >
                Launch Session
              </button>
            </form>
          ) : null}
          <DisplayLinkPanel token={session?.publicToken ?? null} />
        </div>
      </div>
    </div>
  );
}
