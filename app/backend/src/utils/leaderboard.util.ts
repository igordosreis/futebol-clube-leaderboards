import IMatch from '../interfaces/IMatch';
import ILeaderboard from '../interfaces/ILeaderboard';

const baseStats: ILeaderboard = {
  name: '',
  totalGames: 0,
  totalVictories: 0,
  totalDraws: 0,
  totalLosses: 0,
  goalsFavor: 0,
  goalsOwn: 0,
  goalsBalance: 0,
  totalPoints: 0,
  efficiency: 0,
};

const verifyIfWin = (
  { totalVictories }: ILeaderboard,
  { homeTeamGoals, awayTeamGoals }: IMatch,
  isHome: boolean,
): number => {
  if (isHome) {
    return totalVictories + (homeTeamGoals > awayTeamGoals ? 1 : 0);
  }
  return totalVictories + (awayTeamGoals > homeTeamGoals ? 1 : 0);
};

const verifyIfDraw = (
  { totalDraws }: ILeaderboard,
  { homeTeamGoals, awayTeamGoals }: IMatch,
): number => (totalDraws + (homeTeamGoals === awayTeamGoals ? 1 : 0));

const verifyIfLoss = (
  { totalLosses }: ILeaderboard,
  { homeTeamGoals, awayTeamGoals }: IMatch,
  isHome: boolean,
): number => {
  if (isHome) {
    return totalLosses + (homeTeamGoals < awayTeamGoals ? 1 : 0);
  }
  return totalLosses + (awayTeamGoals < homeTeamGoals ? 1 : 0);
};

const getTotalPoints = (
  victories: number,
  draws: number,
): number => (victories * 3) + (draws);

const getEfficiency = (
  totalPoints: number,
  totalGames: number,
) => ((totalPoints / (totalGames * 3)) * 100).toFixed(2);

const getCurrentTeamStats = (
  currentTeamData: IMatch[],
  isHome: boolean,
): ILeaderboard => currentTeamData
  .reduce((accStats: ILeaderboard, currMatch: IMatch) => {
    const stats = {} as ILeaderboard;

    stats.name = isHome ? currMatch.homeTeam?.teamName : currMatch.awayTeam?.teamName;
    stats.totalGames = currentTeamData.length;
    stats.goalsFavor = accStats.goalsFavor
      + (isHome ? currMatch.homeTeamGoals : currMatch.awayTeamGoals);
    stats.goalsOwn = accStats.goalsOwn
      + (isHome ? currMatch.awayTeamGoals : currMatch.homeTeamGoals);
    stats.totalVictories = verifyIfWin(accStats, currMatch, isHome);
    stats.totalDraws = verifyIfDraw(accStats, currMatch);
    stats.totalLosses = verifyIfLoss(accStats, currMatch, isHome);
    stats.totalPoints = getTotalPoints(stats.totalVictories, stats.totalDraws);
    stats.goalsBalance = stats.goalsFavor - stats.goalsOwn;
    stats.efficiency = getEfficiency(stats.totalPoints, stats.totalGames);

    return stats;
  }, baseStats);

const getAllTeamsStats = (
  allMatches: IMatch[],
  isHome: boolean,
): ILeaderboard[] => allMatches
  .reduce((accTeams: ILeaderboard[], currentTeam: IMatch) => {
    const isCurrentTeamInAcc = accTeams.find(({ name }) => (isHome
      ? name === currentTeam.homeTeam?.teamName
      : name === currentTeam.awayTeam?.teamName));
    if (isCurrentTeamInAcc) return accTeams;

    const currentTeamData = allMatches.filter((team) => (isHome
      ? team.homeTeamId === currentTeam.homeTeamId
      : team.awayTeamId === currentTeam.awayTeamId));
    const teamStats = getCurrentTeamStats(currentTeamData, isHome);

    return [...accTeams, teamStats];
  }, []);

const mergeCurrentTeamStats = (
  awayStats: ILeaderboard,
  homeStats: ILeaderboard,
): ILeaderboard => {
  const stats = {} as ILeaderboard;

  stats.name = awayStats.name;
  stats.totalGames = awayStats.totalGames + homeStats.totalGames;
  stats.goalsFavor = awayStats.goalsFavor + homeStats.goalsFavor;
  stats.goalsOwn = awayStats.goalsOwn + homeStats.goalsOwn;
  stats.totalVictories = awayStats.totalVictories + homeStats.totalVictories;
  stats.totalDraws = awayStats.totalDraws + homeStats.totalDraws;
  stats.totalLosses = awayStats.totalLosses + homeStats.totalLosses;
  stats.totalPoints = awayStats.totalPoints + homeStats.totalPoints;
  stats.goalsBalance = awayStats.goalsBalance + homeStats.goalsBalance;
  stats.efficiency = getEfficiency(stats.totalPoints, stats.totalGames);

  return stats;
};

const mergeAllTeamsStats = (
  teamsStatsAway: ILeaderboard[],
  teamsStatsHome: ILeaderboard[],
): ILeaderboard[] => {
  const teamsStats = teamsStatsAway.map((teamStatsAway: ILeaderboard) => {
    const teamStatsHome = teamsStatsHome
      .find(({ name }) => name === teamStatsAway.name) as ILeaderboard;
    const teamStats = mergeCurrentTeamStats(
      teamStatsAway,
      teamStatsHome,
    );

    return teamStats;
  });

  return teamsStats;
};

const sortTeams = (teams: ILeaderboard[]): ILeaderboard[] => teams
  .sort((teamA, teamB) => teamB.totalPoints - teamA.totalPoints
  || teamB.totalVictories - teamA.totalVictories
  || teamB.goalsBalance - teamA.goalsBalance
  || teamB.goalsFavor - teamA.goalsFavor
  || teamA.goalsOwn - teamB.goalsOwn);

const getLeaderboardHome = (allMatches: IMatch[]): ILeaderboard[] => {
  const homeTeamsStats = getAllTeamsStats(allMatches, true);

  return sortTeams(homeTeamsStats);
};

const getLeaderboardAway = (allMatches: IMatch[]): ILeaderboard[] => {
  const awayTeamsStats = getAllTeamsStats(allMatches, false);

  return sortTeams(awayTeamsStats);
};

const getLeaderboard = (allMatches: IMatch[]): ILeaderboard[] => {
  const teamsStatsAsAway = getAllTeamsStats(allMatches, false);
  const teamsStatsAsHome = getAllTeamsStats(allMatches, true);
  const teamsStats = mergeAllTeamsStats(teamsStatsAsAway, teamsStatsAsHome);

  return sortTeams(teamsStats);
};

export { getLeaderboardHome, getLeaderboardAway, getLeaderboard };
