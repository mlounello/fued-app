export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-[color:var(--border)] bg-white/40 p-8">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-[color:var(--muted-foreground)]">
        {description}
      </p>
    </div>
  );
}
