import { AnswerRevealPanel } from "@/components/run/AnswerRevealPanel";
import { BoardNavigator } from "@/components/run/BoardNavigator";
import { LiveDisplayPreview } from "@/components/run/LiveDisplayPreview";
import { RunScreenModeControls } from "@/components/run/RunScreenModeControls";
import { ScoreControlPanel } from "@/components/run/ScoreControlPanel";
import { SessionHeader } from "@/components/run/SessionHeader";
import { StrikeControlPanel } from "@/components/run/StrikeControlPanel";
import { SessionRealtimeRefresh } from "@/components/shared/SessionRealtimeRefresh";
import { getRunScreenData } from "@/lib/services/session-service";

export default async function RunGamePage({
  params,
}: {
  params: Promise<{ gameId: string }>;
}) {
  const { gameId } = await params;
  const data = await getRunScreenData(gameId);

  return (
    <div className="space-y-6">
      <SessionRealtimeRefresh sessionId={data.session?.sessionId ?? null} />
      <SessionHeader game={data.game} session={data.session} />
      <BoardNavigator boards={data.boards} session={data.session} />
      <RunScreenModeControls session={data.session} />
      <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
        <LiveDisplayPreview
          game={data.game}
          session={data.session}
          boards={data.boards}
        />
        <div className="space-y-6">
          <ScoreControlPanel game={data.game} session={data.session} />
          <StrikeControlPanel session={data.session} />
          <AnswerRevealPanel boards={data.boards} session={data.session} />
        </div>
      </div>
    </div>
  );
}
