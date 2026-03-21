import type { CSSProperties } from "react";

export function StrikeDisplay({ count }: { count: number }) {
  return (
    <div
      className="flex items-center gap-3 rounded-2xl px-6 py-4 text-2xl font-bold"
      style={{
        backgroundColor: "color-mix(in srgb, var(--display-primary) 72%, transparent)",
        color: "var(--display-accent)",
      } as CSSProperties}
    >
      <span>Strikes</span>
      <span style={{ color: "var(--display-secondary)" } as CSSProperties}>{count}</span>
    </div>
  );
}
