import { z } from "zod";

export const updateGameSettingsSchema = z.object({
  gameId: z.string().uuid(),
  title: z.string().trim().min(1).max(120),
  showTeamNames: z.boolean(),
  showScores: z.boolean(),
  team1Name: z.string().trim().min(1).max(60),
  team2Name: z.string().trim().min(1).max(60),
  brandPrimaryColor: z.string().trim().min(4).max(20),
  brandSecondaryColor: z.string().trim().min(4).max(20),
  brandAccentColor: z.string().trim().min(4).max(20).nullable(),
  brandBackgroundColor: z.string().trim().min(4).max(20).nullable(),
});

export const boardSchema = z.object({
  gameId: z.string().uuid(),
  questionText: z.string().trim().min(1).max(500),
  sortOrder: z.number().int().positive(),
});

export const answerSchema = z.object({
  boardId: z.string().uuid(),
  answerText: z.string().trim().min(1).max(200),
  pointValue: z.number().int().min(0).max(999),
  displayPosition: z.number().int().positive().max(8),
  sortOrder: z.number().int().positive().max(8),
});
