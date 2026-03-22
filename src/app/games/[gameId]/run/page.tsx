import { RunGameWorkspace } from "@/components/run/RunGameWorkspace";
import { getRunScreenData } from "@/lib/services/session-service";

export default async function RunGamePage({
  params,
}: {
  params: Promise<{ gameId: string }>;
}) {
  const { gameId } = await params;
  const data = await getRunScreenData(gameId);

  return <RunGameWorkspace initialData={data} />;
}
