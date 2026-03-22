import type { GameSettings } from "@/types/games";

import { AssetUploader } from "./AssetUploader";

export function GameAssetsPanel({ game }: { game: GameSettings }) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <AssetUploader
        aspect="square"
        assetType="logo"
        gameId={game.id}
        imageUrl={game.assets.logoUrl}
        label="Logo"
        ownerUserId={game.ownerUserId}
      />
      <AssetUploader
        assetType="pregame_image"
        gameId={game.id}
        imageUrl={game.assets.pregameUrl}
        label="Pregame Image"
        ownerUserId={game.ownerUserId}
      />
      <AssetUploader
        assetType="postgame_image"
        gameId={game.id}
        imageUrl={game.assets.postgameUrl}
        label="Postgame Image"
        ownerUserId={game.ownerUserId}
      />
    </div>
  );
}
