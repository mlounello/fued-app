export type SessionStatus = "inactive" | "live" | "paused" | "ended";
export type ScreenMode =
  | "pregame"
  | "board"
  | "question_overlay"
  | "postgame";
export type ScoringTarget = "team_1" | "team_2" | "none";

export interface SessionSummary {
  sessionId: string;
  publicToken: string;
  sessionStatus: SessionStatus;
  currentBoardId: string | null;
  currentScreen: ScreenMode;
  strikesCount: number;
  soundEnabled: boolean;
  score1: number;
  score2: number;
}

export interface SessionAnswerState {
  answerId: string;
  boardId: string;
  isRevealed: boolean;
  revealedForTeam: ScoringTarget | null;
  revealedAt: string | null;
}

export interface RunBoardAnswer {
  id: string;
  boardId: string;
  answerText: string;
  pointValue: number;
  displayPosition: number;
  sortOrder: number;
  isRevealed: boolean;
  revealedForTeam: ScoringTarget | null;
}

export interface RunBoard {
  id: string;
  questionText: string;
  sortOrder: number;
  answers: RunBoardAnswer[];
}

export interface RunScreenData {
  game: {
    id: string;
    title: string;
    showTeamNames: boolean;
    showScores: boolean;
    team1Name: string;
    team2Name: string;
    branding: {
      headingFont: "Oswald";
      subheadFont: "Gudea";
      bodyFont: "Merriweather";
      brandPrimaryColor: string;
      brandSecondaryColor: string;
      brandAccentColor: string | null;
      brandBackgroundColor: string | null;
    };
    assets: {
      logoUrl: string | null;
      pregameUrl: string | null;
      postgameUrl: string | null;
    };
  };
  session: SessionSummary | null;
  boards: RunBoard[];
}
