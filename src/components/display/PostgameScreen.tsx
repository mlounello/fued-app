import type { DisplayPayload } from "@/types/display";

export function PostgameScreen({ payload }: { payload: DisplayPayload }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center text-center">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-yellow-300">
          Thanks for playing
        </p>
        <h1 className="mt-4 text-6xl font-bold">{payload.game.title}</h1>
      </div>
    </div>
  );
}
