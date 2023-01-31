import ILeaderboard from '../interfaces/ILeaderboard';
import IMatch from '../interfaces/IMatch';
import { getLeaderboardHome, getLeaderboardAway, getLeaderboard } from '../utils/leaderboard.util';
import MatchService from './Match.service';

export default class LeaderboardService {
  public static async getHomeLeaderboard() {
    const allMatches: IMatch[] = await MatchService.findMatchesInProgress(false);
    const homeTeamsLeaderboard: ILeaderboard[] = getLeaderboardHome(allMatches);

    return homeTeamsLeaderboard;
  }

  public static async getAwayLeaderboard() {
    const allMatches: IMatch[] = await MatchService.findMatchesInProgress(false);
    const awayTeamsLeaderboard: ILeaderboard[] = getLeaderboardAway(allMatches);

    return awayTeamsLeaderboard;
  }

  public static async getLeaderboard() {
    const allMatches: IMatch[] = await MatchService.findMatchesInProgress(false);
    const teamsLeaderboard: ILeaderboard[] = getLeaderboard(allMatches);

    return teamsLeaderboard;
  }
}
