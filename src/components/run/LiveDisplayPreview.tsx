import { DisplayShell } from "@/components/display/DisplayShell";
import type { DisplayPayload } from "@/types/display";
import type { RunScreenData } from "@/types/sessions";

export function LiveDisplayPreview({
  game,
  session,
  boards,
}: {
  game: RunScreenData["game"];
  session: RunScreenData["session"];
  boards: RunScreenData["boards"];
}) {
  if (!session) {
    return (
      <div className="rounded-[2rem] border border-[color:var(--border)] bg-[#101827] p-6 text-white">
        <div className="text-sm uppercase tracking-[0.3em] text-yellow-300">
          Audience Preview
        </div>
        <h2 className="mt-4 text-4xl font-bold">{game.title}</h2>
        <p className="mt-3 text-sm text-slate-300">
          Launch a session to preview the public display.
        </p>
      </div>
    );
  }

  const previewPayload: DisplayPayload = {
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
      logo: null,
      pregameImage: null,
      postgameImage: null,
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

  return (
    <div className="overflow-hidden rounded-[2rem] border border-[color:var(--border)] bg-black/10">
      <div className="border-b border-white/10 bg-[#101827] px-6 py-4 text-white">
        <div className="text-sm uppercase tracking-[0.3em] text-yellow-300">
          Audience Preview
        </div>
      </div>
      <div className="origin-top-left scale-[0.82] overflow-hidden" style={{ width: "121.95%" }}>
        <DisplayShell payload={previewPayload} />
      </div>
    </div>
  );
}
