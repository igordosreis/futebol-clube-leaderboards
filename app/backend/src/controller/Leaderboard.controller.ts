import { Request, Response } from 'express';
import LeaderboardService from '../services/Leaderboard.service';

export default class LeaderboardController {
  public static async getHomeLeaderboard(_req: Request, res: Response) {
    const homeLeaderboard = await LeaderboardService.getHomeLeaderboard();

    res.status(200).json(homeLeaderboard);
  }

  public static async getAwayLeaderboard(_req: Request, res: Response) {
    const awayLeaderboard = await LeaderboardService.getAwayLeaderboard();

    res.status(200).json(awayLeaderboard);
  }

  public static async getLeaderboard(_req: Request, res: Response) {
    const leaderboard = await LeaderboardService.getLeaderboard();

    res.status(200).json(leaderboard);
  }
}
