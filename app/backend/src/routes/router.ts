import { Router } from 'express';
import userRoutes from './user.routes';
import teamRoutes from './team.routes';

const router = Router();

router.use('/login', userRoutes);
router.use('/teams', teamRoutes);

export default router;
