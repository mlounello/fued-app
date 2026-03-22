"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import { resolveDisplayTheme } from "@/lib/utils/display-theme";
import type { DisplayPayload } from "@/types/display";

import { BoardScreen } from "./BoardScreen";
import { PostgameScreen } from "./PostgameScreen";
import { PregameScreen } from "./PregameScreen";
import { QuestionOverlay } from "./QuestionOverlay";

export function DisplayShell({ payload }: { payload: DisplayPayload }) {
  const [displayedPayload, setDisplayedPayload] = useState(payload);
  const [phase, setPhase] = useState<"idle" | "out" | "in">("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const needsTransition =
    displayedPayload.state.currentScreen !== payload.state.currentScreen ||
    displayedPayload.state.currentBoardId !== payload.state.currentBoardId;

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (!needsTransition) {
      setDisplayedPayload(payload);
      return;
    }

    setPhase("out");

    timeoutRef.current = setTimeout(() => {
      setDisplayedPayload(payload);
      setPhase("in");

      timeoutRef.current = setTimeout(() => {
        setPhase("idle");
      }, 260);
    }, 180);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [needsTransition, payload]);

  const board =
    displayedPayload.boards.find(
      (item) => item.id === displayedPayload.state.currentBoardId,
    ) ??
    displayedPayload.boards[0] ??
    null;

  const theme = resolveDisplayTheme({
    brandPrimaryColor: displayedPayload.game.brandPrimaryColor,
    brandSecondaryColor: displayedPayload.game.brandSecondaryColor,
    brandAccentColor: displayedPayload.game.brandAccentColor,
    brandBackgroundColor: displayedPayload.game.brandBackgroundColor,
  });

  const transitionStyle = useMemo(
    () =>
      ({
        transition:
          "transform 260ms cubic-bezier(0.22, 1, 0.36, 1), opacity 220ms ease",
        transform:
          phase === "out"
            ? "scale(0.94) translateY(2.5vh)"
            : phase === "in"
              ? "scale(1.01) translateY(0)"
              : "scale(1) translateY(0)",
        opacity: phase === "out" ? 0 : 1,
      }) as CSSProperties,
    [phase],
  );

  return (
    <div
      className="h-screen w-full overflow-hidden px-[max(0.75rem,1.4vw)] py-[max(0.75rem,1.4vh)] text-white"
      style={
        {
          backgroundColor: theme.background,
          color: theme.accent,
          "--display-primary": theme.primary,
          "--display-secondary": theme.secondary,
          "--display-accent": theme.accent,
          "--display-background": theme.background,
        } as CSSProperties
      }
    >
      <div className="h-full w-full" style={transitionStyle}>
        {displayedPayload.state.currentScreen === "pregame" ? (
          <PregameScreen payload={displayedPayload} />
        ) : null}
        {displayedPayload.state.currentScreen === "board" && board ? (
          <BoardScreen payload={displayedPayload} board={board} />
        ) : null}
        {displayedPayload.state.currentScreen === "question_overlay" && board ? (
          <QuestionOverlay payload={displayedPayload} board={board} />
        ) : null}
        {displayedPayload.state.currentScreen === "postgame" ? (
          <PostgameScreen payload={displayedPayload} />
        ) : null}
      </div>
    </div>
  );
}
