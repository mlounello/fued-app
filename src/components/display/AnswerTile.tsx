"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

import type { DisplayAnswer } from "@/types/display";

export function AnswerTile({ answer }: { answer: DisplayAnswer }) {
  const [revealed, setRevealed] = useState(answer.isRevealed);

  useEffect(() => {
    if (answer.isRevealed) {
      const frame = requestAnimationFrame(() => {
        setRevealed(true);
      });

      return () => cancelAnimationFrame(frame);
    }

    setRevealed(false);
  }, [answer.isRevealed]);

  return (
    <div
      className="relative flex min-h-0 h-full items-center justify-center rounded-[1.2rem] border-[4px] px-[clamp(0.75rem,1.2vw,1.2rem)] py-[clamp(0.45rem,0.9vh,0.8rem)]"
      style={
        {
          backgroundColor: "var(--display-primary)",
          borderColor: "var(--display-secondary)",
          color: "var(--display-accent)",
        } as CSSProperties
      }
    >
      <div
        className="absolute inset-[6px] rounded-[0.8rem] border-[3px]"
        style={
          {
            borderColor: "var(--display-secondary)",
            background:
              "linear-gradient(180deg, color-mix(in srgb, var(--display-primary) 76%, white 24%) 0%, var(--display-primary) 58%, color-mix(in srgb, var(--display-primary) 84%, black 16%) 100%)",
            transformOrigin: "top center",
            transform: revealed ? "rotateX(-92deg)" : "rotateX(0deg)",
            transition: "transform 300ms cubic-bezier(0.2, 0.95, 0.25, 1)",
            backfaceVisibility: "hidden",
            boxShadow: revealed
              ? "0 12px 18px rgba(0,0,0,0.22)"
              : "inset 0 2px 0 rgba(255,255,255,0.18)",
          } as CSSProperties
        }
      />
      <div
        className="relative flex w-full items-center justify-center"
        style={{
          opacity: revealed ? 1 : 0.14,
          transform: revealed ? "scale(1)" : "scale(0.96)",
          transition: "opacity 180ms ease 110ms, transform 220ms ease 110ms",
        }}
      >
        <span className="max-w-[calc(100%-4.25rem)] text-center text-[clamp(1.1rem,min(2.6vw,2.8vh),2.4rem)] font-black leading-[0.92] tracking-tight">
          {answer.answerText ?? "........"}
        </span>
        <span
          className="absolute right-[clamp(0.6rem,1vw,1rem)] top-1/2 -translate-y-1/2 text-right text-[clamp(1rem,min(2vw,2.2vh),2rem)] font-black leading-none"
          style={{ color: "var(--display-secondary)" } as CSSProperties}
        >
          {answer.isRevealed ? answer.pointValue : ""}
        </span>
      </div>
    </div>
  );
}
