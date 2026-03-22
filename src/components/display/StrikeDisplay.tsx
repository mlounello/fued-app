import type { CSSProperties } from "react";

export function StrikeDisplay({ count }: { count: number }) {
  return (
    <div
      className="flex items-center gap-4 rounded-[1.4rem] border-[4px] px-5 py-4 text-[clamp(1.5rem,2.2vw,2.4rem)] font-black"
      style={
        {
          backgroundColor: "var(--display-primary)",
          borderColor: "var(--display-secondary)",
          color: "var(--display-accent)",
        } as CSSProperties
      }
    >
      <span className="uppercase tracking-[0.12em]">Strikes</span>
      <span
        className="text-[clamp(2.2rem,3.8vw,3.6rem)] leading-none"
        style={{ color: "var(--display-secondary)" } as CSSProperties}
      >
        {count}
      </span>
    </div>
  );
}
