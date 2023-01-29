import { Router } from 'express';
import validateTokenMiddleware from '../middlewares/validateToken.middleware';
import MatchController from '../controller/Match.controller';

const matchRouter = Router();

matchRouter.route('/')
  .get(
    MatchController.findMatches,
  )
  .post(
    validateTokenMiddleware,
    MatchController.saveMatchInProgress,
  );

matchRouter.patch(
  '/:id/finish',
  MatchController.updateMatchToFinished,
);

matchRouter.patch(
  '/:id',
  MatchController.updateMatchGoals,
);

export default matchRouter;
