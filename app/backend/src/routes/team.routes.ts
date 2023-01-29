import { Router } from 'express';
import TeamController from '../controller/Team.controller';

const teamRouter = Router();

teamRouter.get(
  '/',
  TeamController.findAllTeams,
);

teamRouter.get(
  '/:id',
  TeamController.findTeamById,
);

export default teamRouter;
