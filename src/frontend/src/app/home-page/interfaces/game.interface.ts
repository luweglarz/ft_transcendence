export interface Game {
  id: number;
  createdAt: string;
  winnerId: number;
  winnerGoals: number;
  loserId: number;
  loserGoals: number;
}
