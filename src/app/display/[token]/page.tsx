import { notFound } from "next/navigation";

import { DisplayShell } from "@/components/display/DisplayShell";
import { SessionRealtimeRefresh } from "@/components/shared/SessionRealtimeRefresh";
import { resolveDisplayTheme } from "@/lib/utils/display-theme";
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

  const theme = resolveDisplayTheme({
    brandPrimaryColor: payload.game.brandPrimaryColor,
    brandSecondaryColor: payload.game.brandSecondaryColor,
    brandAccentColor: payload.game.brandAccentColor,
    brandBackgroundColor: payload.game.brandBackgroundColor,
  });

  return (
    <div
      className="min-h-screen w-full"
      style={{ backgroundColor: theme.background }}
    >
      <SessionRealtimeRefresh sessionId={payload.session.id} />
      <DisplayShell payload={payload} />
    </div>
  );
}
