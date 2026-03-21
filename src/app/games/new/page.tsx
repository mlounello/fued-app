import { createGame } from "@/actions/games";

export default async function NewGamePage() {
  await createGame();
  return null;
}
