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

const currentTeamBaseStatistics = (
  currentTeamData: IMatch[],
  home: boolean,
): ITeamBaseStatistics => currentTeamData
  .reduce((accStat: ITeamBaseStatistics, currMatch) => ({
    ...accStat,
    name: home ? currMatch.homeTeam?.teamName : currMatch.awayTeam?.teamName,
    totalGames: currentTeamData.length,
    goalsFavor: accStat.goalsFavor + (home ? currMatch.homeTeamGoals : currMatch.awayTeamGoals),
    goalsOwn: accStat.goalsOwn + (home ? currMatch.awayTeamGoals : currMatch.homeTeamGoals),
    totalVictories: accStat.totalVictories + (home
      ? verifyIfWin(currMatch.homeTeamGoals, currMatch.awayTeamGoals)
      : verifyIfWin(currMatch.awayTeamGoals, currMatch.homeTeamGoals)),
    totalDraws: accStat.totalDraws + (home
      ? verifyIfDraw(currMatch.homeTeamGoals, currMatch.awayTeamGoals)
      : verifyIfDraw(currMatch.awayTeamGoals, currMatch.homeTeamGoals)),
    totalLosses: accStat.totalLosses + (home
      ? verifyIfLoss(currMatch.homeTeamGoals, currMatch.awayTeamGoals)
      : verifyIfLoss(currMatch.awayTeamGoals, currMatch.homeTeamGoals)),
  }), { ...baseStatistics });

const getTeamsBaseStats = (
  allMatches: IMatch[],
  home: boolean,
): ITeamBaseStatistics[] => allMatches
  .reduce((accTeams: ITeamBaseStatistics[], currentTeam) => {
    const isCurrentTeamInAcc = accTeams.find(({ name }) => (home
      ? name === currentTeam.homeTeam?.teamName
      : name === currentTeam.awayTeam?.teamName));
    if (isCurrentTeamInAcc) return accTeams;

    const currentTeamData = home
      ? allMatches.filter(({ homeTeamId }) => homeTeamId === currentTeam.homeTeamId)
      : allMatches.filter(({ awayTeamId }) => awayTeamId === currentTeam.awayTeamId);

    const teamBaseStatistcs = currentTeamBaseStatistics(currentTeamData, home);

    return [...accTeams, teamBaseStatistcs];
  }, [] as ITeamBaseStatistics[]);

const sortTeams = (teams: ITeamStatistics[]): ITeamStatistics[] => teams
  .sort((teamA, teamB) => teamB.totalPoints - teamA.totalPoints
  || teamB.totalVictories - teamA.totalVictories
  || teamB.goalsBalance - teamA.goalsBalance
  || teamB.goalsFavor - teamA.goalsFavor
  || teamA.goalsOwn - teamB.goalsOwn);

const getPartialLeaderboard = (teamsBaseStats: ITeamBaseStatistics[]): ITeamStatistics[] => {
  const partialLeaderboard = teamsBaseStats
    .map((team: ITeamBaseStatistics) => {
      const totalPoints = totalPointsAmount(team.totalVictories, team.totalDraws);
      const efficiency = ((totalPoints / (team.totalGames * 3)) * 100).toFixed(2);
      const goalsBalance = team.goalsFavor - team.goalsOwn;

      return { ...team, totalPoints, efficiency, goalsBalance };
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

const getFullLeaderboard = (
  baseStatsAway: ITeamBaseStatistics[],
  baseStatsHome: ITeamBaseStatistics[],
): ITeamStatistics[] => {
  const teamsBaseStats = baseStatsAway.map((teamAway: ITeamBaseStatistics) => {
    const teamStatsHome = baseStatsHome.find(({ name }) => name === teamAway.name);
    const teamStats = mergeTeamStatistics(teamAway, teamStatsHome as ITeamStatistics);

    return teamStats;
  });
  const teamFullStats = getPartialLeaderboard(teamsBaseStats);
  const sortedFullLeaderboard = sortTeams(teamFullStats);

  return sortedFullLeaderboard;
};

const getHomeLeaderboard = (allMatches: IMatch[]): ITeamStatistics[] => {
  const homeTeamsBaseStats = getTeamsBaseStats(allMatches, true);
  const homeTeamsLeaderbaord = getPartialLeaderboard(homeTeamsBaseStats);

  return homeTeamsLeaderbaord;
};

const getAwayLeaderboard = (allMatches: IMatch[]): ITeamStatistics[] => {
  const awayTeamsBaseStats = getTeamsBaseStats(allMatches, false);
  const awayTeamsLeaderboard = getPartialLeaderboard(awayTeamsBaseStats);

  return awayTeamsLeaderboard;
};

const getLeaderboard = (allMatches: IMatch[]): ITeamStatistics[] => {
  const teamsBaseStatsAsHome = getTeamsBaseStats(allMatches, true);
  const teamsBaseStatsAsAway = getTeamsBaseStats(allMatches, false);
  const teamsFullLeaderboard = getFullLeaderboard(teamsBaseStatsAsAway, teamsBaseStatsAsHome);

  return teamsFullLeaderboard;
};

export { getHomeLeaderboard, getAwayLeaderboard, getLeaderboard };
