import { CopyButton } from "@/components/shared/CopyButton";

export function DisplayLinkPanel({ token }: { token: string | null }) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "";
  const displayUrl = token
    ? `${baseUrl || "http://localhost:3000"}/display/${token}`
    : null;

  return (
    <div className="space-y-2 text-right">
      <div className="text-sm font-medium">Display Link</div>
      {displayUrl ? (
        <div className="flex items-center gap-2">
          <span className="max-w-xs truncate text-sm text-[color:var(--muted-foreground)]">
            {displayUrl}
          </span>
          <CopyButton value={displayUrl} />
        </div>
      ) : (
        <p className="text-sm text-[color:var(--muted-foreground)]">
          Launch a session to generate the public display link.
        </p>
      )}
    </div>
  );
}
