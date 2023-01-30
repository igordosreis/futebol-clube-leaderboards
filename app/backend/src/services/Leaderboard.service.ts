import IMatch from '../interfaces/IMatch';
import { getHomeTeamsStats, getAwayTeamsStats, getAllTeamsStats } from '../utils/leaderboard.util';
// import MatchModel from '../database/models/MatchModel';
// import TeamModel from '../database/models/TeamModel';
import MatchService from './Match.service';

export default class LeaderboardService {
  public static async getHomeLeaderboard() {
    const allMatches = await MatchService.findMatchesInProgress(false) as unknown as IMatch[];
    const homeTeamsLeaderboard = getHomeTeamsStats(allMatches);

    return homeTeamsLeaderboard;
  }

  public static async getAwayLeaderboard() {
    const allMatches = await MatchService.findMatchesInProgress(false) as unknown as IMatch[];
    const awayTeamsLeaderboard = getAwayTeamsStats(allMatches);

    return awayTeamsLeaderboard;
  }

  public static async getLeaderboard() {
    const allMatches = await MatchService.findMatchesInProgress(false) as unknown as IMatch[];
    const teamsLeaderboard = getAllTeamsStats(allMatches);

    return teamsLeaderboard;
  }
}
