import { Router } from 'express';
import MatchController from '../controller/Match.controller';

const matchRouter = Router();

matchRouter.get(
  '/',
  MatchController.findMatches,
);

// matchRouter.get(
//   '/:id',
//   MatchController.findMatchById,
// );

export default matchRouter;
