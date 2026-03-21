import type { AdminUserRow } from "@/types/admin";

export function UsersTable({ users }: { users: AdminUserRow[] }) {
  return (
    <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)] p-4">
      <div className="grid gap-3">
        {users.map((user) => (
          <div key={user.id} className="grid gap-1 rounded-2xl border border-[color:var(--border)] bg-white/70 p-4">
            <div className="font-medium">{user.email}</div>
            <div className="text-sm text-[color:var(--muted-foreground)]">
              Admin: {user.isAdmin ? "Yes" : "No"} | Disabled: {user.isDisabled ? "Yes" : "No"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
