"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { updateGameSettings } from "@/actions/games";
import type { GameSettings } from "@/types/games";

export function GameSetupForm({ game }: { game: GameSettings }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [title, setTitle] = useState(game.title);
  const [team1Name, setTeam1Name] = useState(game.team1Name);
  const [team2Name, setTeam2Name] = useState(game.team2Name);
  const [showTeamNames, setShowTeamNames] = useState(game.showTeamNames);
  const [showScores, setShowScores] = useState(game.showScores);
  const [brandPrimaryColor, setBrandPrimaryColor] = useState(game.branding.brandPrimaryColor);
  const [brandSecondaryColor, setBrandSecondaryColor] = useState(game.branding.brandSecondaryColor);
  const [brandAccentColor, setBrandAccentColor] = useState(game.branding.brandAccentColor ?? "");
  const [brandBackgroundColor, setBrandBackgroundColor] = useState(game.branding.brandBackgroundColor ?? "");
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)] p-6"
      onSubmit={(event) => {
        event.preventDefault();
        startTransition(async () => {
          try {
            setError(null);
            await updateGameSettings({
              gameId: game.id,
              title,
              showTeamNames,
              showScores,
              team1Name,
              team2Name,
              brandPrimaryColor,
              brandSecondaryColor,
              brandAccentColor: brandAccentColor || null,
              brandBackgroundColor: brandBackgroundColor || null,
            });
            router.refresh();
          } catch (caughtError) {
            setError(
              caughtError instanceof Error ? caughtError.message : "Unable to save game settings.",
            );
          }
        });
      }}
    >
      <h2 className="text-xl font-semibold">Game Setup</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-medium">Title</span>
          <input className="rounded-xl border border-[color:var(--border)] bg-white px-3 py-2" value={title} onChange={(event) => setTitle(event.target.value)} />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium">Team 1</span>
          <input className="rounded-xl border border-[color:var(--border)] bg-white px-3 py-2" value={team1Name} onChange={(event) => setTeam1Name(event.target.value)} />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium">Team 2</span>
          <input className="rounded-xl border border-[color:var(--border)] bg-white px-3 py-2" value={team2Name} onChange={(event) => setTeam2Name(event.target.value)} />
        </label>
        <div className="grid gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input checked={showTeamNames} onChange={(event) => setShowTeamNames(event.target.checked)} type="checkbox" />
            Show team names
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input checked={showScores} onChange={(event) => setShowScores(event.target.checked)} type="checkbox" />
            Show scores
          </label>
        </div>
        <label className="grid gap-2">
          <span className="text-sm font-medium">Primary color</span>
          <input className="rounded-xl border border-[color:var(--border)] bg-white px-3 py-2" value={brandPrimaryColor} onChange={(event) => setBrandPrimaryColor(event.target.value)} />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium">Secondary color</span>
          <input className="rounded-xl border border-[color:var(--border)] bg-white px-3 py-2" value={brandSecondaryColor} onChange={(event) => setBrandSecondaryColor(event.target.value)} />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium">Accent color</span>
          <input className="rounded-xl border border-[color:var(--border)] bg-white px-3 py-2" value={brandAccentColor} onChange={(event) => setBrandAccentColor(event.target.value)} />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium">Background color</span>
          <input className="rounded-xl border border-[color:var(--border)] bg-white px-3 py-2" value={brandBackgroundColor} onChange={(event) => setBrandBackgroundColor(event.target.value)} />
        </label>
      </div>
      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-[color:var(--muted-foreground)]">
          Fonts are locked to the curated MVP system.
        </div>
        <button
          className="rounded-xl bg-[color:var(--secondary)] px-4 py-2 text-sm text-[color:var(--secondary-foreground)]"
          disabled={pending}
          type="submit"
        >
          {pending ? "Saving..." : "Save Setup"}
        </button>
      </div>
    </form>
  );
}
