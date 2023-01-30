import IMatch from '../interfaces/IMatch';
import ITeamStatistics from '../interfaces/ITeamStatistics';

// name: currentTeamData[0].homeTeam?.teamName,
// totalGames: currentTeamData.length,
// totalPoints: 0,
// totalVictories: 0,
// totalDraws: 0,
// totalLosses: 0,
// goalsFavor: 0,
// goalsOwn: 0,
// goalsBalance: 0,
// efficiency: 0,

const baseStatistics: Partial<ITeamStatistics> = {
  name: '',
  totalGames: 0,
  totalVictories: 0,
  totalDraws: 0,
  totalLosses: 0,
  goalsFavor: 0,
  goalsOwn: 0,
  goalsBalance: 0,
};

const verifyIfWin = (homeGoals: number, awayGoals: number) => (homeGoals > awayGoals ? 1 : 0);
const verifyIfDraw = (homeGoals: number, awayGoals: number) => (homeGoals === awayGoals ? 1 : 0);
const verifyIfLoss = (homeGoals: number, awayGoals: number) => (homeGoals < awayGoals ? 1 : 0);
const totalPointsAmount = (victories: any, draws: any) => (victories * 3) + (draws);

const currentTeamFullStatistics = (teamBaseStatistics: any) => {
  const totalPoints = totalPointsAmount(
    teamBaseStatistics.totalVictories,
    teamBaseStatistics.totalDraws,
  );

  const efficiency = ((totalPoints / (teamBaseStatistics.totalGames * 3)) * 100).toFixed(2);

  const goalsBalance = teamBaseStatistics.goalsFavor - teamBaseStatistics.goalsOwn;

  return { ...teamBaseStatistics, totalPoints, efficiency, goalsBalance };
};

const currentTeamBaseStatistics = (currentTeamData: IMatch[]) => {
  const currentTeamStatistcs = currentTeamData.reduce((accStat: any, currentMatch) => ({
    ...accStat,
    name: currentMatch.homeTeam?.teamName,
    totalGames: currentTeamData.length,
    goalsFavor: accStat.goalsFavor + currentMatch.homeTeamGoals,
    goalsOwn: accStat.goalsOwn + currentMatch.awayTeamGoals,
    totalVictories: accStat
      .totalVictories + verifyIfWin(currentMatch.homeTeamGoals, currentMatch.awayTeamGoals),
    totalDraws: accStat
      .totalDraws + verifyIfDraw(currentMatch.homeTeamGoals, currentMatch.awayTeamGoals),
    totalLosses: accStat
      .totalLosses + verifyIfLoss(currentMatch.homeTeamGoals, currentMatch.awayTeamGoals),
  }), { ...baseStatistics });

  return currentTeamStatistcs;
};

const sortTeams = (teams: ITeamStatistics[]) => teams
  .sort((teamA, teamB) => teamB.totalPoints - teamA.totalPoints
  || teamB.totalVictories - teamA.totalVictories
  || teamB.goalsBalance - teamA.goalsBalance
  || teamB.goalsFavor - teamA.goalsFavor
  || teamA.goalsOwn - teamB.goalsOwn);

const getHomeTeamsStats = (allMatches: IMatch[]) => {
  const homeTeamsStats = allMatches
    .reduce((accTeams: any[], currentTeam) => {
      const isCurrentTeamInAcc = accTeams
        .find(({ name }) => name === currentTeam.homeTeam?.teamName);
      if (isCurrentTeamInAcc) {
        return accTeams;
      }

      const currentTeamData = allMatches
        .filter(({ homeTeamId }) => homeTeamId === currentTeam.homeTeamId);

      const teamBaseStatistcs = currentTeamBaseStatistics(currentTeamData);
      const teamFullStatistics = currentTeamFullStatistics(teamBaseStatistcs);

      return [...accTeams, teamFullStatistics];
    }, [] as ITeamStatistics[]);

  const sortedHomeTeamsStats = sortTeams(homeTeamsStats);

  return sortedHomeTeamsStats;
};

export { getHomeTeamsStats, totalPointsAmount };
