import { Router } from 'express';
import LeaderboardController from '../controller/Leaderboard.controller';

const leaderboardRouter = Router();

leaderboardRouter.get(
  '/',
  // LeaderboardController,
);

leaderboardRouter.get(
  '/home',
  LeaderboardController.getHomeLeaderboard,
);

leaderboardRouter.get(
  '/away',
  LeaderboardController.getAwayLeaderboard,
);

export default leaderboardRouter;
