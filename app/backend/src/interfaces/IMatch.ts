export interface IMatchGoals {
  homeTeamGoals: number;
  awayTeamGoals: number;
}

export default interface IMatch extends IMatchGoals {
  id?: number;
  homeTeamId: number;
  awayTeamId: number;
  inProgress?: boolean;
  homeTeam?: {
    teamName: string;
  }
  awayTeam?: {
    teamName: string;
  }
}
