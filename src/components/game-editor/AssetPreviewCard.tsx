export function AssetPreviewCard({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-[color:var(--border)] p-4">
      {label}
    </div>
  );
}
