import { createClient } from "@/lib/supabase/browser";

export function subscribeToSession(sessionId: string, onChange: () => void) {
  const supabase = createClient();

  const channel = supabase
    .channel(`session-${sessionId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "app_public",
        table: "session_state",
        filter: `session_id=eq.${sessionId}`,
      },
      () => onChange(),
    )
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "app_public",
        table: "session_board_answers",
        filter: `session_id=eq.${sessionId}`,
      },
      () => onChange(),
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}
