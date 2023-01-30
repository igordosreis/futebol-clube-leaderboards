export interface ITeamBaseStatistics {
  name: string | undefined;
  totalGames: number;
  totalVictories: number;
  totalDraws: number;
  totalLosses: number;
  goalsFavor: number;
  goalsOwn: number;
}

export default interface ITeamStatistics extends ITeamBaseStatistics {
  name: string | undefined;
  totalPoints: number;
  goalsBalance: number;
  efficiency: number | string;
}
