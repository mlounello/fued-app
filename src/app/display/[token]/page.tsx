import { notFound } from "next/navigation";

import { DisplayShell } from "@/components/display/DisplayShell";
import { SessionRealtimeRefresh } from "@/components/shared/SessionRealtimeRefresh";
import { getDisplayPayloadByToken } from "@/lib/services/display-service";

export default async function DisplayPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const payload = await getDisplayPayloadByToken(token);

  if (!payload) {
    notFound();
  }

  return (
    <>
      <SessionRealtimeRefresh sessionId={payload.session.id} />
      <DisplayShell payload={payload} />
    </>
  );
}
