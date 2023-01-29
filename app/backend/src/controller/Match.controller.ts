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

  // public static async findMatchesInProgress(req: Request, res: Response) {
  //   const isInProgress = 'inProgress' in req.params;

  //   if (isInProgress) {
  //     const { inProgress } = req.params;

  //     const progressStringToBool = inProgress === 'true';
  //     const matchesInProgress = await MatchService.findMatchesInProgress(progressStringToBool);

  //     return res.status(200).json(matchesInProgress);
  //   }

  //   UserController.findAllMatches(req, res);
  // }
}
