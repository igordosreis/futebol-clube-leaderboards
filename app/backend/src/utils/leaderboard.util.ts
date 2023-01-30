import IMatch from '../interfaces/IMatch';
import ITeamStatistics, { ITeamBaseStatistics } from '../interfaces/ITeamStatistics';

const baseStatistics: ITeamBaseStatistics = {
  name: '',
  totalGames: 0,
  totalVictories: 0,
  totalDraws: 0,
  totalLosses: 0,
  goalsFavor: 0,
  goalsOwn: 0,
};

const verifyIfWin = (
  homeGoals: number,
  awayGoals: number,
): number => (homeGoals > awayGoals ? 1 : 0);

const verifyIfDraw = (
  homeGoals: number,
  awayGoals: number,
): number => (homeGoals === awayGoals ? 1 : 0);

const verifyIfLoss = (
  homeGoals: number,
  awayGoals: number,
): number => (homeGoals < awayGoals ? 1 : 0);

const totalPointsAmount = (
  victories: number,
  draws: number,
): number => (victories * 3) + (draws);

const getCurrentTeamBaseStats = (
  currentTeamData: IMatch[],
  isHome: boolean,
): ITeamBaseStatistics => currentTeamData
  .reduce((accStat: ITeamBaseStatistics, currMatch: IMatch) => ({
    ...accStat,
    name: isHome ? currMatch.homeTeam?.teamName : currMatch.awayTeam?.teamName,
    totalGames: currentTeamData.length,
    goalsFavor: accStat.goalsFavor + (isHome ? currMatch.homeTeamGoals : currMatch.awayTeamGoals),
    goalsOwn: accStat.goalsOwn + (isHome ? currMatch.awayTeamGoals : currMatch.homeTeamGoals),
    totalVictories: accStat.totalVictories + (isHome
      ? verifyIfWin(currMatch.homeTeamGoals, currMatch.awayTeamGoals)
      : verifyIfWin(currMatch.awayTeamGoals, currMatch.homeTeamGoals)),
    totalDraws: accStat.totalDraws + (isHome
      ? verifyIfDraw(currMatch.homeTeamGoals, currMatch.awayTeamGoals)
      : verifyIfDraw(currMatch.awayTeamGoals, currMatch.homeTeamGoals)),
    totalLosses: accStat.totalLosses + (isHome
      ? verifyIfLoss(currMatch.homeTeamGoals, currMatch.awayTeamGoals)
      : verifyIfLoss(currMatch.awayTeamGoals, currMatch.homeTeamGoals)),
  }), { ...baseStatistics });

const getTeamsBaseStats = (
  allMatches: IMatch[],
  isHome: boolean,
): ITeamBaseStatistics[] => allMatches
  .reduce((accTeams: ITeamBaseStatistics[], currentTeam: IMatch) => {
    const isCurrentTeamInAcc = accTeams.find(({ name }) => (isHome
      ? name === currentTeam.homeTeam?.teamName
      : name === currentTeam.awayTeam?.teamName));
    if (isCurrentTeamInAcc) return accTeams;

    const currentTeamData = isHome
      ? allMatches.filter(({ homeTeamId }) => homeTeamId === currentTeam.homeTeamId)
      : allMatches.filter(({ awayTeamId }) => awayTeamId === currentTeam.awayTeamId);
    const teamBaseStatistcs = getCurrentTeamBaseStats(currentTeamData, isHome);

    return [...accTeams, teamBaseStatistcs];
  }, []);

const sortTeams = (teams: ITeamStatistics[]): ITeamStatistics[] => teams
  .sort((teamA, teamB) => teamB.totalPoints - teamA.totalPoints
  || teamB.totalVictories - teamA.totalVictories
  || teamB.goalsBalance - teamA.goalsBalance
  || teamB.goalsFavor - teamA.goalsFavor
  || teamA.goalsOwn - teamB.goalsOwn);

const createPartialLeaderboard = (teamsBaseStats: ITeamBaseStatistics[]): ITeamStatistics[] => {
  const partialLeaderboard = teamsBaseStats
    .map((teamBaseStats: ITeamBaseStatistics) => {
      const totalPoints = totalPointsAmount(teamBaseStats.totalVictories, teamBaseStats.totalDraws);
      const efficiency = ((totalPoints / (teamBaseStats.totalGames * 3)) * 100).toFixed(2);
      const goalsBalance = teamBaseStats.goalsFavor - teamBaseStats.goalsOwn;

      return { ...teamBaseStats, totalPoints, efficiency, goalsBalance };
    });
  const sortedPartialLeaderboard = sortTeams(partialLeaderboard);

  return sortedPartialLeaderboard;
};

const mergeTeamStatistics = (
  awayStats: ITeamBaseStatistics,
  homeStats: ITeamBaseStatistics,
): ITeamBaseStatistics => ({
  name: awayStats.name,
  totalGames: awayStats.totalGames + homeStats.totalGames,
  goalsFavor: awayStats.goalsFavor + homeStats.goalsFavor,
  goalsOwn: awayStats.goalsOwn + homeStats.goalsOwn,
  totalVictories: awayStats.totalVictories + homeStats.totalVictories,
  totalDraws: awayStats.totalDraws + homeStats.totalDraws,
  totalLosses: awayStats.totalLosses + homeStats.totalLosses,
});

const createFullLeaderboard = (
  teamsBaseStatsAway: ITeamBaseStatistics[],
  teamsBaseStatsHome: ITeamBaseStatistics[],
): ITeamStatistics[] => {
  const teamsBaseStats = teamsBaseStatsAway.map((teamBaseStatsAway: ITeamBaseStatistics) => {
    const teamBaseStatsHome = teamsBaseStatsHome
      .find(({ name }) => name === teamBaseStatsAway.name) as ITeamBaseStatistics;
    const teamBaseStats = mergeTeamStatistics(
      teamBaseStatsAway,
      teamBaseStatsHome,
    );

    return teamBaseStats;
  });
  const teamsStats = createPartialLeaderboard(teamsBaseStats);
  const sortedFullLeaderboard = sortTeams(teamsStats);

  return sortedFullLeaderboard;
};

const getLeaderboardHome = (allMatches: IMatch[]): ITeamStatistics[] => {
  const homeTeamsBaseStats = getTeamsBaseStats(allMatches, true);
  const homeTeamsLeaderboard = createPartialLeaderboard(homeTeamsBaseStats);

  return homeTeamsLeaderboard;
};

const getLeaderboardAway = (allMatches: IMatch[]): ITeamStatistics[] => {
  const awayTeamsBaseStats = getTeamsBaseStats(allMatches, false);
  const awayTeamsLeaderboard = createPartialLeaderboard(awayTeamsBaseStats);

  return awayTeamsLeaderboard;
};

const getLeaderboard = (allMatches: IMatch[]): ITeamStatistics[] => {
  const teamsBaseStatsAsAway = getTeamsBaseStats(allMatches, false);
  const teamsBaseStatsAsHome = getTeamsBaseStats(allMatches, true);
  const allTeamsLeaderboard = createFullLeaderboard(teamsBaseStatsAsAway, teamsBaseStatsAsHome);

  return allTeamsLeaderboard;
};

export { getLeaderboardHome, getLeaderboardAway, getLeaderboard };
