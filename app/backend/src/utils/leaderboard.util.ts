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

const currentTeamBaseStatistics = (currentTeamData: IMatch[], home: boolean) => {
  const currentTeamStatistcs = currentTeamData.reduce((accStat: any, currentMatch) => ({
    ...accStat,
    name: home ? currentMatch.homeTeam?.teamName : currentMatch.awayTeam?.teamName,
    totalGames: currentTeamData.length,
    goalsFavor: accStat.goalsFavor + (home
      ? currentMatch.homeTeamGoals : currentMatch.awayTeamGoals),
    goalsOwn: accStat.goalsOwn + (home ? currentMatch.awayTeamGoals : currentMatch.homeTeamGoals),
    totalVictories: accStat.totalVictories + (home
      ? verifyIfWin(currentMatch.homeTeamGoals, currentMatch.awayTeamGoals)
      : verifyIfWin(currentMatch.awayTeamGoals, currentMatch.homeTeamGoals)),
    totalDraws: accStat.totalDraws + (home
      ? verifyIfDraw(currentMatch.homeTeamGoals, currentMatch.awayTeamGoals)
      : verifyIfDraw(currentMatch.awayTeamGoals, currentMatch.homeTeamGoals)),
    totalLosses: accStat.totalLosses + (home
      ? verifyIfLoss(currentMatch.homeTeamGoals, currentMatch.awayTeamGoals)
      : verifyIfLoss(currentMatch.awayTeamGoals, currentMatch.homeTeamGoals)),
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

      const teamBaseStatistcs = currentTeamBaseStatistics(currentTeamData, true);
      const teamFullStatistics = currentTeamFullStatistics(teamBaseStatistcs);

      return [...accTeams, teamFullStatistics];
    }, [] as ITeamStatistics[]);

  const sortedHomeTeamsStats = sortTeams(homeTeamsStats);

  return sortedHomeTeamsStats;
};

const getAwayTeamsStats = (allMatches: IMatch[]) => {
  const awayTeamsStats = allMatches
    .reduce((accTeams: any[], currentTeam) => {
      const isCurrentTeamInAcc = accTeams
        .find(({ name }) => name === currentTeam.awayTeam?.teamName);
      if (isCurrentTeamInAcc) {
        return accTeams;
      }

      const currentTeamData = allMatches
        .filter(({ awayTeamId }) => awayTeamId === currentTeam.awayTeamId);

      const teamBaseStatistcs = currentTeamBaseStatistics(currentTeamData, false);
      const teamFullStatistics = currentTeamFullStatistics(teamBaseStatistcs);

      return [...accTeams, teamFullStatistics];
    }, [] as ITeamStatistics[]);

  const sortedAwayTeamsStats = sortTeams(awayTeamsStats);

  return sortedAwayTeamsStats;
};

export { getHomeTeamsStats, getAwayTeamsStats };
