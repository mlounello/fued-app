"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { uploadGameAsset } from "@/actions/assets";

import { AssetPreviewCard } from "./AssetPreviewCard";

export function AssetUploader({
  gameId,
  ownerUserId,
  assetType,
  label,
  imageUrl,
  aspect = "wide",
}: {
  gameId: string;
  ownerUserId: string;
  assetType: "logo" | "pregame_image" | "postgame_image";
  label: string;
  imageUrl: string | null;
  aspect?: "square" | "wide";
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const uploadSelectedFile = (file: File) => {
    startTransition(async () => {
      try {
        setError(null);
        await uploadGameAsset({
          gameId,
          ownerUserId,
          assetType,
          file,
        });
        router.refresh();
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to upload asset.",
        );
      } finally {
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      }
    });
  };

  return (
    <div className="space-y-3 rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)] p-5">
      <AssetPreviewCard aspect={aspect} imageUrl={imageUrl} label={label} />
      <div className="flex flex-wrap items-center gap-3">
        <input
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          disabled={pending}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              uploadSelectedFile(file);
            }
          }}
          ref={inputRef}
          type="file"
        />
        <button
          className="rounded-xl bg-[color:var(--secondary)] px-4 py-2 text-sm text-[color:var(--secondary-foreground)]"
          disabled={pending}
          onClick={() => inputRef.current?.click()}
          type="button"
        >
          {imageUrl ? (pending ? "Replacing..." : "Replace Asset") : pending ? "Uploading..." : "Upload Asset"}
        </button>
        <div className="text-sm text-[color:var(--muted-foreground)]">
          PNG, JPG, or WebP up to 10MB
        </div>
      </div>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
