import IMatch from '../interfaces/IMatch';
import { getHomeTeamsStats } from '../utils/leaderboard.util';
// import MatchModel from '../database/models/MatchModel';
// import TeamModel from '../database/models/TeamModel';
import MatchService from './Match.service';

export default class LeaderboardService {
  public static async getHomeLeaderboard() {
    const allMatches = await MatchService.findMatchesInProgress(false) as unknown as IMatch[];
    const homeTeamsLeaderboard = getHomeTeamsStats(allMatches);

    return homeTeamsLeaderboard;
    // return allMatches;
  }
}
