import type { ScreenMode, SessionStatus } from "@/types/sessions";

export interface DisplayAnswer {
  id: string;
  displayPosition: number;
  sortOrder: number;
  pointValue: number;
  isRevealed: boolean;
  answerText: string | null;
}

export interface DisplayBoard {
  id: string;
  questionText: string;
  sortOrder: number;
  answers: DisplayAnswer[];
}

export interface DisplayPayload {
  session: {
    id: string;
    publicToken: string;
    status: SessionStatus;
    startedAt: string | null;
    endedAt: string | null;
  };
  game: {
    id: string;
    title: string;
    showTeamNames: boolean;
    showScores: boolean;
    team1Name: string;
    team2Name: string;
    headingFont: "Oswald";
    subheadFont: "Gudea";
    bodyFont: "Merriweather";
    brandPrimaryColor: string;
    brandSecondaryColor: string;
    brandAccentColor: string | null;
    brandBackgroundColor: string | null;
  };
  assets: {
    logo: { path: string; bucket: string; mimeType: string; url: string } | null;
    pregameImage: { path: string; bucket: string; mimeType: string; url: string } | null;
    postgameImage: { path: string; bucket: string; mimeType: string; url: string } | null;
  };
  state: {
    currentBoardId: string | null;
    currentScreen: ScreenMode;
    strikesCount: number;
    soundEnabled: boolean;
    score1: number;
    score2: number;
  };
  boards: DisplayBoard[];
}
