import { Request, Response } from 'express';
import MatchService from '../services/Match.service';

export default class UserController {
  public static async findMatches(req: Request, res: Response) {
    const isInProgressRequested: boolean = 'inProgress' in req.query;

    if (isInProgressRequested) {
      const { inProgress } = req.query;

      const inProgressStringToBool = inProgress === 'true';
      const matchesInProgress = await MatchService.findMatchesInProgress(inProgressStringToBool);

      return res.status(200).json(matchesInProgress);
    }
    const allMatches = await MatchService.findAllMatches();

    return res.status(200).json(allMatches);
  }

  public static async saveMatchInProgress(req: Request, res: Response) {
    const { body: matchInProgress } = req;

    const newMatch = await MatchService.saveMatchInProgress(matchInProgress);

    return res.status(201).json(newMatch);
  }

  public static async updateMatchToFinished(req: Request, res: Response) {
    const { id } = req.params;

    await MatchService.updateMatchToFinished(Number(id));

    res.status(200).json({ message: 'Finished' });
  }
}
