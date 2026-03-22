export type FontHeading = "Oswald";
export type FontSubhead = "Gudea";
export type FontBody = "Merriweather";

export type GameStatus = "draft" | "live" | "archived";

export interface GameSummary {
  id: string;
  title: string;
  status: GameStatus;
  showTeamNames: boolean;
  showScores: boolean;
  team1Name: string;
  team2Name: string;
  updatedAt: string;
  deletedAt: string | null;
  boardCount: number;
  hasLiveSession: boolean;
}

export interface GameBranding {
  headingFont: FontHeading;
  subheadFont: FontSubhead;
  bodyFont: FontBody;
  brandPrimaryColor: string;
  brandSecondaryColor: string;
  brandAccentColor: string | null;
  brandBackgroundColor: string | null;
}

export interface GameAssets {
  logoAssetId: string | null;
  logoUrl: string | null;
  pregameAssetId: string | null;
  pregameUrl: string | null;
  postgameAssetId: string | null;
  postgameUrl: string | null;
}

export interface GameSettings {
  id: string;
  ownerUserId: string;
  title: string;
  status: GameStatus;
  showTeamNames: boolean;
  showScores: boolean;
  team1Name: string;
  team2Name: string;
  branding: GameBranding;
  assets: GameAssets;
  createdAt: string;
  updatedAt: string;
}

export interface BoardSummary {
  id: string;
  gameId: string;
  questionText: string;
  sortOrder: number;
  answerCount: number;
}

export interface AnswerItem {
  id: string;
  boardId: string;
  answerText: string;
  pointValue: number;
  displayPosition: number;
  sortOrder: number;
}

export interface GameBoardDetail {
  id: string;
  gameId: string;
  questionText: string;
  sortOrder: number;
  answers: AnswerItem[];
}
