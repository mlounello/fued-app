import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";

export interface StoredAssetRow {
  id: string;
  storage_bucket: string;
  storage_path: string;
  mime_type: string;
  original_filename: string | null;
}

export async function createSignedAssetUrl(
  bucket: string,
  path: string,
  expiresInSeconds = 60 * 60 * 24,
) {
  const supabase = createAdminClient();
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresInSeconds);

  if (error || !data?.signedUrl) {
    throw new Error(`Failed to sign asset URL: ${error?.message ?? "Unknown error"}`);
  }

  return data.signedUrl;
}

export async function resolveSignedAssetMap(assetRows: StoredAssetRow[]) {
  const entries = await Promise.all(
    assetRows.map(async (asset) => [
      asset.id,
      {
        id: asset.id,
        url: await createSignedAssetUrl(asset.storage_bucket, asset.storage_path),
        mimeType: asset.mime_type,
        originalFilename: asset.original_filename,
        bucket: asset.storage_bucket,
        path: asset.storage_path,
      },
    ] as const),
  );

  return new Map(entries);
}
