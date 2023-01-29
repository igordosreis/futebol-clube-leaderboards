import { Router } from 'express';
import validateTokenMiddleware from '../middlewares/validateToken.middleware';
import MatchController from '../controller/Match.controller';

const matchRouter = Router();

matchRouter.get(
  '/',
  MatchController.findMatches,
);

matchRouter.post(
  '/',
  validateTokenMiddleware,
  MatchController.saveMatchInProgress,
);

// matchRouter.get(
//   '/:id',
//   MatchController.findMatchById,
// );

export default matchRouter;
