import { DisplayShell } from "@/components/display/DisplayShell";
import type { DisplayPayload } from "@/types/display";

export function LiveDisplayPreview({
  gameTitle,
  payload,
}: {
  gameTitle: string;
  payload: DisplayPayload | null;
}) {
  if (!payload) {
    return (
      <div className="rounded-[2rem] border border-[color:var(--border)] bg-[#101827] p-6 text-white">
        <div className="text-sm uppercase tracking-[0.3em] text-yellow-300">
          Audience Preview
        </div>
        <h2 className="mt-4 text-4xl font-bold">{gameTitle}</h2>
        <p className="mt-3 text-sm text-slate-300">
          Launch a session to preview the public display.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[2rem] border border-[color:var(--border)] bg-black/10">
      <div className="border-b border-white/10 bg-[#101827] px-6 py-4 text-white">
        <div className="text-sm uppercase tracking-[0.3em] text-yellow-300">
          Audience Preview
        </div>
      </div>
      <div
        className="origin-top-left scale-[0.82] overflow-hidden"
        style={{ width: "121.95%" }}
      >
        <DisplayShell payload={payload} />
      </div>
    </div>
  );
}
