import { Router } from 'express';
import TeamController from '../controller/Team.controller';

const teamRouter = Router();

teamRouter.get(
  '/',
  TeamController.findAllTeams,
);

export default teamRouter;
