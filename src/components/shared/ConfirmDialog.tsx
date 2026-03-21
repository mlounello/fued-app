"use client";

export function ConfirmDialog({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-4">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-[color:var(--muted-foreground)]">
        {description}
      </p>
    </div>
  );
}
