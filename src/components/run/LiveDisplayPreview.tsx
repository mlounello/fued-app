import type { RunScreenData } from "@/types/sessions";

export function LiveDisplayPreview({
  game,
  session,
}: {
  game: RunScreenData["game"];
  session: RunScreenData["session"];
  boards: RunScreenData["boards"];
}) {
  return (
    <div className="rounded-[2rem] border border-[color:var(--border)] bg-[#101827] p-6 text-white">
      <div className="text-sm uppercase tracking-[0.3em] text-yellow-300">
        Audience Preview
      </div>
      <h2 className="mt-4 text-4xl font-bold">{game.title}</h2>
      <p className="mt-3 text-sm text-slate-300">
        Screen mode: {session?.currentScreen ?? "pregame"}
      </p>
    </div>
  );
}
