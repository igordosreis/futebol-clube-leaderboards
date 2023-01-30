import { Router } from 'express';
import userRoutes from './user.routes';
import teamRoutes from './team.routes';
import matchRouter from './match.routes';
import leaderboardRouter from './leaderboard.routes';

const router = Router();

router.use('/login', userRoutes);
router.use('/teams', teamRoutes);
router.use('/matches', matchRouter);
router.use('/leaderboard', leaderboardRouter);

export default router;
