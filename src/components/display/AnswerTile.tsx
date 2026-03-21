"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

import type { DisplayAnswer } from "@/types/display";

export function AnswerTile({ answer }: { answer: DisplayAnswer }) {
  const [isVisible, setIsVisible] = useState(answer.isRevealed);

  useEffect(() => {
    if (answer.isRevealed) {
      const frame = requestAnimationFrame(() => {
        setIsVisible(true);
      });

      return () => cancelAnimationFrame(frame);
    }

    setIsVisible(false);
  }, [answer.isRevealed]);

  return (
    <div
      className="relative min-h-28 [perspective:1200px]"
      style={{ transformStyle: "preserve-3d" } as CSSProperties}
    >
      <div
        className="absolute inset-0 rounded-2xl border transition-transform duration-700"
        style={
          {
            backgroundColor: "var(--display-primary)",
            borderColor: "var(--display-secondary)",
            transformStyle: "preserve-3d",
            transform: isVisible ? "rotateX(0deg)" : "rotateX(88deg)",
            boxShadow: isVisible
              ? "0 0 0 2px var(--display-secondary)"
              : "none",
          } as CSSProperties
        }
      />

      <div
        className="relative flex min-h-28 items-center justify-between rounded-2xl border px-5 py-4 transition-all duration-700"
        style={
          {
            backgroundColor: "var(--display-primary)",
            borderColor: "var(--display-secondary)",
            color: "var(--display-accent)",
            boxShadow: isVisible
              ? "0 0 0 2px var(--display-secondary)"
              : "none",
            transform: isVisible ? "rotateX(0deg) scale(1.02)" : "rotateX(88deg) scale(0.98)",
            transformStyle: "preserve-3d",
            opacity: isVisible || !answer.isRevealed ? 1 : 0.98,
          } as CSSProperties
        }
      >
        <span
          className="text-xl font-bold"
          style={{ color: "var(--display-secondary)" } as CSSProperties}
        >
          {answer.displayPosition}
        </span>

        <span
          className={`text-center text-2xl font-semibold transition-all duration-500 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-1 opacity-70"
          }`}
        >
          {answer.answerText ?? "........"}
        </span>

        <span
          className={`text-xl font-bold transition-all duration-500 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{ color: "var(--display-secondary)" } as CSSProperties}
        >
          {answer.isRevealed ? answer.pointValue : ""}
        </span>
      </div>
    </div>
  );
}
