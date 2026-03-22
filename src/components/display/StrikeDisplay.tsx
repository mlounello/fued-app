import type { CSSProperties } from "react";

export function StrikeDisplay({ count }: { count: number }) {
  return (
    <div
      className="flex items-center gap-[clamp(0.45rem,1vw,0.9rem)] rounded-[1.2rem] border-[4px] px-[clamp(0.85rem,1.3vw,1.2rem)] py-[clamp(0.55rem,1vh,0.9rem)] text-[clamp(1.1rem,min(1.8vw,2.2vh),1.8rem)] font-black"
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
        className="text-[clamp(1.8rem,min(3vw,3.5vh),3rem)] leading-none"
        style={{ color: "var(--display-secondary)" } as CSSProperties}
      >
        {count}
      </span>
    </div>
  );
}
