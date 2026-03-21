import type { StorageSummary } from "@/types/admin";

export function StorageSummaryPanel({
  storage,
}: {
  storage: StorageSummary;
}) {
  return (
    <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)] p-6">
      <div className="text-sm text-[color:var(--muted-foreground)]">Assets</div>
      <div className="mt-1 text-3xl font-bold">{storage.totalAssets}</div>
      <div className="mt-4 text-sm text-[color:var(--muted-foreground)]">Bytes</div>
      <div className="mt-1 text-2xl font-semibold">{storage.totalBytes}</div>
    </div>
  );
}
