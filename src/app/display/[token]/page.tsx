import { notFound } from "next/navigation";

import { LiveDisplayStage } from "@/components/display/LiveDisplayStage";
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

  return <LiveDisplayStage initialPayload={payload} token={token} />;
}
