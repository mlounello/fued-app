export function PageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold">{title}</h1>
      {description ? (
        <p className="text-sm text-[color:var(--muted-foreground)]">
          {description}
        </p>
      ) : null}
    </div>
  );
}
