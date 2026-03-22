"use client";

import { useEffect, useRef, useState } from "react";

import { mapDisplayPayloadData } from "@/lib/display/map-display-payload";
import { subscribeToSession } from "@/lib/realtime/display-realtime";
import { createClient } from "@/lib/supabase/browser";
import type { DisplayPayload } from "@/types/display";

import { DisplayShell } from "./DisplayShell";

export function LiveDisplayStage({
  initialPayload,
  token,
}: {
  initialPayload: DisplayPayload;
  token: string;
}) {
  const [payload, setPayload] = useState(initialPayload);
  const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setPayload(initialPayload);
  }, [initialPayload]);

  useEffect(() => {
    const supabase = createClient();

    const refreshPayload = async () => {
      const { data, error } = await supabase
        .schema("fued_public")
        .rpc("get_display_payload", { p_public_token: token });

      if (error || !data) {
        return;
      }

      setPayload(mapDisplayPayloadData(data));
    };

    const unsubscribe = subscribeToSession(initialPayload.session.id, () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }

      refreshTimeoutRef.current = setTimeout(() => {
        void refreshPayload();
      }, 40);
    });

    return () => {
      unsubscribe();

      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [initialPayload.session.id, token]);

  return <DisplayShell payload={payload} />;
}
