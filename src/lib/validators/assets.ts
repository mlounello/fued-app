import { z } from "zod";

export const allowedAssetTypes = [
  "image/png",
  "image/jpeg",
  "image/webp",
] as const;

export const assetUploadSchema = z.object({
  gameId: z.string().uuid(),
  assetType: z.enum(["logo", "pregame_image", "postgame_image"]),
});

export function validateAssetFile(file: File) {
  if (
    !allowedAssetTypes.includes(
      file.type as (typeof allowedAssetTypes)[number],
    )
  ) {
    throw new Error("Unsupported file type.");
  }

  const maxBytes = 10 * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error("File is too large.");
  }
}
