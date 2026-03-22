import { NextResponse } from "next/server";

import { getDisplayPayloadByToken } from "@/lib/services/display-service";

export async function GET(
  _request: Request,
  context: { params: Promise<{ token: string }> },
) {
  const { token } = await context.params;
  const payload = await getDisplayPayloadByToken(token);

  if (!payload) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(payload);
}
