"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { subscribeToSession } from "@/lib/realtime/display-realtime";

export function SessionRealtimeRefresh({
  sessionId,
}: {
  sessionId: string | null;
}) {
  const router = useRouter();
  const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    const unsubscribe = subscribeToSession(sessionId, () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }

      refreshTimeoutRef.current = setTimeout(() => {
        router.refresh();
      }, 120);
    });

    return () => {
      unsubscribe();

      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [router, sessionId]);

  return null;
}
