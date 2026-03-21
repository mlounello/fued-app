import { GameEditorTabs } from "@/components/game-editor/GameEditorTabs";
import { getGameEditorData } from "@/lib/services/game-service";

export default async function EditGamePage({
  params,
}: {
  params: Promise<{ gameId: string }>;
}) {
  const { gameId } = await params;
  const data = await getGameEditorData(gameId);

  return <GameEditorTabs game={data.game} boards={data.boards} />;
}
