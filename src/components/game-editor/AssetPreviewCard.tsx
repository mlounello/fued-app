export function AssetPreviewCard({
  label,
  imageUrl,
  aspect = "wide",
}: {
  label: string;
  imageUrl: string | null;
  aspect?: "square" | "wide";
}) {
  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-white/70 p-4">
      <div className="text-sm font-medium">{label}</div>
      <div
        className={`mt-3 overflow-hidden rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] ${
          aspect === "square" ? "aspect-square" : "aspect-[16/9]"
        }`}
      >
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt={label}
            className="h-full w-full object-cover"
            src={imageUrl}
          />
        ) : (
          <div className="flex h-full items-center justify-center px-4 text-center text-sm text-[color:var(--muted-foreground)]">
            No asset assigned
          </div>
        )}
      </div>
    </div>
  );
}
