"use client";

import { useEffect, useRef, useState } from "react";

import { subscribeToSession } from "@/lib/realtime/display-realtime";
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
    const refreshPayload = async () => {
      const response = await fetch(`/api/display-payload/${token}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        return;
      }

      const nextPayload = (await response.json()) as DisplayPayload;
      setPayload(nextPayload);
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
