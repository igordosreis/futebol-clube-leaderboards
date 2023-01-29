import { Request, Response } from 'express';
import TeamService from '../services/Team.service';

export default class UserController {
  public static async findAllTeams(_req: Request, res: Response) {
    const allTeams = await TeamService.findAllTeams();

    res.status(200).json(allTeams);
  }
}
