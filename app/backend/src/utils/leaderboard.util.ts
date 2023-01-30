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
const totalPointsAmount = (victories: number, draws: number) => (victories * 3) + (draws);

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
    .reduce((accTeams: ITeamStatistics[], currentTeam) => {
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

const mergeTeamStatistics = (awayStats: ITeamStatistics, homeStats: ITeamStatistics) => ({
  name: awayStats.name,
  totalGames: awayStats.totalGames + homeStats.totalGames,
  goalsFavor: awayStats.goalsFavor + homeStats.goalsFavor,
  goalsOwn: awayStats.goalsOwn + homeStats.goalsOwn,
  totalVictories: awayStats.totalVictories + homeStats.totalVictories,
  totalDraws: awayStats.totalDraws + homeStats.totalDraws,
  totalLosses: awayStats.totalLosses + homeStats.totalLosses,
});

const getTeamFullStats = (baseStatsAway: ITeamStatistics[], baseStatsHome: ITeamStatistics[]) => {
  const teamsBaseStats = baseStatsAway.map((teamAway: ITeamStatistics) => {
    const teamStatsHome = baseStatsHome.find(({ name }) => name === teamAway.name);
    const teamStats = mergeTeamStatistics(teamAway, teamStatsHome as ITeamStatistics);
    return teamStats;
  });
  const teamFullStats = teamsBaseStats.map((team) => currentTeamFullStatistics(team));
  const sortedTeams = sortTeams(teamFullStats);
  return sortedTeams;
};

const getAwayTeamsStats = (allMatches: IMatch[]) => {
  const awayTeamsStats = allMatches
    .reduce((accTeams: ITeamStatistics[], currentTeam) => {
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

const getAllTeamsStats = (allMatches: IMatch[]) => {
  const teamsBaseStatsAsHome = allMatches.reduce((accTeams: ITeamStatistics[], currT) => {
    const isCurrentTeamInAcc = accTeams
      .find(({ name }) => name === currT.homeTeam?.teamName);
    if (isCurrentTeamInAcc) return accTeams;
    const currentTeamData = allMatches.filter(({ homeTeamId }) => homeTeamId === currT.homeTeamId);
    const teamBaseStatistcs = currentTeamBaseStatistics(currentTeamData, true);
    return [...accTeams, teamBaseStatistcs];
  }, [] as ITeamStatistics[]);
  const teamsBaseStatsAsAway = allMatches.reduce((accTeams: ITeamStatistics[], currT) => {
    const isCurrentTeamInAcc = accTeams
      .find(({ name }) => name === currT.awayTeam?.teamName);
    if (isCurrentTeamInAcc) return accTeams;
    const currentTeamData = allMatches.filter(({ awayTeamId }) => awayTeamId === currT.awayTeamId);
    const teamBaseStatistcs = currentTeamBaseStatistics(currentTeamData, false);
    return [...accTeams, teamBaseStatistcs];
  }, [] as ITeamStatistics[]);
  return getTeamFullStats(teamsBaseStatsAsAway, teamsBaseStatsAsHome);
};

export { getHomeTeamsStats, getAwayTeamsStats, getAllTeamsStats };
