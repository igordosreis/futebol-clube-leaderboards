export interface ITeamBaseStatistics {
  name?: string;
  totalGames: number;
  totalVictories: number;
  totalDraws: number;
  totalLosses: number;
  goalsFavor: number;
  goalsOwn: number;
}

export default interface ITeamStatistics extends ITeamBaseStatistics {
  totalPoints: number;
  goalsBalance: number;
  efficiency: number | string;
}
