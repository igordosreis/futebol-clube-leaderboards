export default interface ILeaderboard {
  name?: string;
  totalGames: number;
  totalVictories: number;
  totalDraws: number;
  totalLosses: number;
  goalsFavor: number;
  goalsOwn: number;
  totalPoints: number;
  goalsBalance: number;
  efficiency?: number | string;
}
