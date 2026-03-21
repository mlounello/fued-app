import { createClient } from "@/lib/supabase/server";
import type { AdminGameRow, AdminUserRow, StorageSummary } from "@/types/admin";

export async function getAdminPageData(): Promise<{
  users: AdminUserRow[];
  games: AdminGameRow[];
  storage: StorageSummary;
}> {
  const supabase = await createClient();

  const [
    { data: users, error: usersError },
    { data: games, error: gamesError },
    { data: assets, error: assetsError },
  ] = await Promise.all([
    supabase
      .schema("app_public")
      .from("profiles")
      .select("id, email, display_name, is_admin, is_disabled, created_at, last_login_at")
      .order("created_at", { ascending: false }),
    supabase
      .schema("app_public")
      .from("games")
      .select("id, title, owner_user_id, status, updated_at, deleted_at")
      .order("updated_at", { ascending: false }),
    supabase
      .schema("app_public")
      .from("game_assets")
      .select("file_size_bytes")
      .is("deleted_at", null),
  ]);

  if (usersError) throw new Error(usersError.message);
  if (gamesError) throw new Error(gamesError.message);
  if (assetsError) throw new Error(assetsError.message);

  const userEmailMap = new Map(
    (users ?? []).map((user: any) => [user.id, user.email]),
  );

  return {
    users: (users ?? []).map((user: any) => ({
      id: user.id,
      email: user.email,
      displayName: user.display_name,
      isAdmin: user.is_admin,
      isDisabled: user.is_disabled,
      createdAt: user.created_at,
      lastLoginAt: user.last_login_at,
    })),
    games: (games ?? []).map((game: any) => ({
      id: game.id,
      title: game.title,
      ownerUserId: game.owner_user_id,
      ownerEmail: userEmailMap.get(game.owner_user_id) ?? "Unknown",
      status: game.status,
      updatedAt: game.updated_at,
      deletedAt: game.deleted_at,
    })),
    storage: {
      totalAssets: assets?.length ?? 0,
      totalBytes: (assets ?? []).reduce(
        (sum: number, asset: any) => sum + (asset.file_size_bytes ?? 0),
        0,
      ),
    },
  };
}
