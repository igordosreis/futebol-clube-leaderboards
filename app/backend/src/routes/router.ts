import { Router } from 'express';
import userRoutes from './user.routes';
import teamRoutes from './team.routes';
import matchRouter from './match.routes';

const router = Router();

router.use('/login', userRoutes);
router.use('/teams', teamRoutes);
router.use('/matches', matchRouter);

export default router;
