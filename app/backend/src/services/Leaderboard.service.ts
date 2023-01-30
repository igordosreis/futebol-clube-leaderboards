import IMatch from '../interfaces/IMatch';
import { getHomeLeaderboard, getAwayLeaderboard, getLeaderboard } from '../utils/leaderboard.util';
import MatchService from './Match.service';

export default class LeaderboardService {
  public static async getHomeLeaderboard() {
    const allMatches = await MatchService.findMatchesInProgress(false) as unknown as IMatch[];
    const homeTeamsLeaderboard = getHomeLeaderboard(allMatches);

    return homeTeamsLeaderboard;
  }

  public static async getAwayLeaderboard() {
    const allMatches = await MatchService.findMatchesInProgress(false) as unknown as IMatch[];
    const awayTeamsLeaderboard = getAwayLeaderboard(allMatches);

    return awayTeamsLeaderboard;
  }

  public static async getLeaderboard() {
    const allMatches = await MatchService.findMatchesInProgress(false) as unknown as IMatch[];
    const teamsLeaderboard = getLeaderboard(allMatches);

    return teamsLeaderboard;
  }
}
