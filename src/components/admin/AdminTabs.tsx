"use client";

import { useState } from "react";

import type { AdminGameRow, AdminUserRow, StorageSummary } from "@/types/admin";

import { GamesTable } from "./GamesTable";
import { StorageSummaryPanel } from "./StorageSummaryPanel";
import { UsersTable } from "./UsersTable";

type Tab = "users" | "games" | "storage";

export function AdminTabs({
  users,
  games,
  storage,
}: {
  users: AdminUserRow[];
  games: AdminGameRow[];
  storage: StorageSummary;
}) {
  const [tab, setTab] = useState<Tab>("users");

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <button className="rounded-xl border px-3 py-2" onClick={() => setTab("users")} type="button">
          Users
        </button>
        <button className="rounded-xl border px-3 py-2" onClick={() => setTab("games")} type="button">
          Games
        </button>
        <button className="rounded-xl border px-3 py-2" onClick={() => setTab("storage")} type="button">
          Storage
        </button>
      </div>
      {tab === "users" ? <UsersTable users={users} /> : null}
      {tab === "games" ? <GamesTable games={games} /> : null}
      {tab === "storage" ? <StorageSummaryPanel storage={storage} /> : null}
    </div>
  );
}
