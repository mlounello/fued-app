"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  launchOrResumeSession,
  resetSession,
  toggleSound,
} from "@/actions/sessions";
import { AnswerRevealPanel } from "@/components/run/AnswerRevealPanel";
import { BoardNavigator } from "@/components/run/BoardNavigator";
import { LiveDisplayPreview } from "@/components/run/LiveDisplayPreview";
import { RunScreenModeControls } from "@/components/run/RunScreenModeControls";
import { ScoreControlPanel } from "@/components/run/ScoreControlPanel";
import { SessionHeader } from "@/components/run/SessionHeader";
import { StrikeControlPanel } from "@/components/run/StrikeControlPanel";
import { SessionRealtimeRefresh } from "@/components/shared/SessionRealtimeRefresh";
import type { DisplayPayload } from "@/types/display";
import type {
  RunBoard,
  RunBoardAnswer,
  RunScreenData,
  ScoringTarget,
  SessionSummary,
} from "@/types/sessions";

function applySessionPatch(
  session: SessionSummary | null,
  patch: Partial<SessionSummary>,
) {
  return session ? { ...session, ...patch } : session;
}

function resetBoards(boards: RunBoard[]) {
  return boards.map((board) => ({
    ...board,
    answers: board.answers.map((answer) => ({
      ...answer,
      isRevealed: false,
      revealedForTeam: null,
    })),
  }));
}

function updateAnswerReveal(
  boards: RunBoard[],
  answerId: string,
  revealedForTeam: ScoringTarget | null,
) {
  return boards.map((board) => ({
    ...board,
    answers: board.answers.map((answer) =>
      answer.id === answerId
        ? {
            ...answer,
            isRevealed: true,
            revealedForTeam,
          }
        : answer,
    ),
  }));
}

function toDisplayPayload(
  game: RunScreenData["game"],
  session: SessionSummary | null,
  boards: RunBoard[],
): DisplayPayload | null {
  if (!session) {
    return null;
  }

  return {
    session: {
      id: session.sessionId,
      publicToken: session.publicToken,
      status: session.sessionStatus,
      startedAt: null,
      endedAt: null,
    },
    game: {
      id: game.id,
      title: game.title,
      showTeamNames: game.showTeamNames,
      showScores: game.showScores,
      team1Name: game.team1Name,
      team2Name: game.team2Name,
      headingFont: game.branding.headingFont,
      subheadFont: game.branding.subheadFont,
      bodyFont: game.branding.bodyFont,
      brandPrimaryColor: game.branding.brandPrimaryColor,
      brandSecondaryColor: game.branding.brandSecondaryColor,
      brandAccentColor: game.branding.brandAccentColor,
      brandBackgroundColor: game.branding.brandBackgroundColor,
    },
    assets: {
      logo: game.assets.logoUrl
        ? {
            path: "",
            bucket: "fued-game-assets",
            mimeType: "image/*",
            url: game.assets.logoUrl,
          }
        : null,
      pregameImage: game.assets.pregameUrl
        ? {
            path: "",
            bucket: "fued-game-assets",
            mimeType: "image/*",
            url: game.assets.pregameUrl,
          }
        : null,
      postgameImage: game.assets.postgameUrl
        ? {
            path: "",
            bucket: "fued-game-assets",
            mimeType: "image/*",
            url: game.assets.postgameUrl,
          }
        : null,
    },
    state: {
      currentBoardId: session.currentBoardId,
      currentScreen: session.currentScreen,
      strikesCount: session.strikesCount,
      soundEnabled: session.soundEnabled,
      score1: session.score1,
      score2: session.score2,
    },
    boards: boards.map((board) => ({
      id: board.id,
      questionText: board.questionText,
      sortOrder: board.sortOrder,
      answers: board.answers.map((answer) => ({
        id: answer.id,
        displayPosition: answer.displayPosition,
        sortOrder: answer.sortOrder,
        pointValue: answer.pointValue,
        isRevealed: answer.isRevealed,
        answerText: answer.isRevealed ? answer.answerText : null,
      })),
    })),
  };
}

export function RunGameWorkspace({
  initialData,
}: {
  initialData: RunScreenData;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [session, setSession] = useState(initialData.session);
  const [boards, setBoards] = useState(initialData.boards);

  const previewPayload = useMemo(
    () => toDisplayPayload(initialData.game, session, boards),
    [boards, initialData.game, session],
  );

  const withBackgroundRefresh = (fn: () => Promise<void>) => {
    startTransition(async () => {
      await fn();
      router.refresh();
    });
  };

  const handleLaunch = () => {
    withBackgroundRefresh(async () => {
      const nextSession = await launchOrResumeSession(initialData.game.id);
      setSession(nextSession);
      setBoards(resetBoards(initialData.boards));
    });
  };

  const handleSessionPatch = (patch: Partial<SessionSummary>) => {
    setSession((current) => applySessionPatch(current, patch));
  };

  const handleReveal = (result: {
    answerId: string;
    revealedForTeam: ScoringTarget | null;
    score1: number;
    score2: number;
  }) => {
    setBoards((current) =>
      updateAnswerReveal(current, result.answerId, result.revealedForTeam),
    );
    setSession((current) =>
      applySessionPatch(current, {
        score1: result.score1,
        score2: result.score2,
      }),
    );
  };

  const handleToggleSound = () => {
    if (!session) {
      return;
    }

    withBackgroundRefresh(async () => {
      const result = await toggleSound(session.sessionId, !session.soundEnabled);
      setSession((current) =>
        applySessionPatch(current, {
          soundEnabled: result.soundEnabled,
        }),
      );
    });
  };

  const handleReset = () => {
    if (!session) {
      return;
    }

    withBackgroundRefresh(async () => {
      const result = await resetSession(session.sessionId);
      setSession((current) =>
        applySessionPatch(current, {
          currentBoardId: result.currentBoardId,
          currentScreen: result.currentScreen,
          strikesCount: result.strikesCount,
          soundEnabled: result.soundEnabled,
          score1: result.score1,
          score2: result.score2,
        }),
      );
      setBoards((current) => resetBoards(current));
    });
  };

  return (
    <div className="space-y-6">
      <SessionRealtimeRefresh sessionId={session?.sessionId ?? null} />
      <SessionHeader
        game={initialData.game}
        session={session}
        pending={isPending}
        onLaunch={handleLaunch}
        onReset={handleReset}
        onToggleSound={handleToggleSound}
      />
      <BoardNavigator
        boards={boards}
        session={session}
        onSessionChange={handleSessionPatch}
      />
      <RunScreenModeControls
        session={session}
        onSessionChange={handleSessionPatch}
      />
      <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
        <LiveDisplayPreview payload={previewPayload} />
        <div className="space-y-6">
          <ScoreControlPanel
            game={initialData.game}
            session={session}
            onSessionChange={handleSessionPatch}
          />
          <StrikeControlPanel
            session={session}
            onSessionChange={handleSessionPatch}
          />
          <AnswerRevealPanel
            boards={boards}
            session={session}
            onReveal={handleReveal}
          />
        </div>
      </div>
    </div>
  );
}
