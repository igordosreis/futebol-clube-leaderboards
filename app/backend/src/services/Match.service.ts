import IMatch from '../interfaces/IMatch';
import MatchModel from '../database/models/MatchModel';
import TeamModel from '../database/models/TeamModel';

export default class MatchService {
  public static async findAllMatches(): Promise<MatchModel[]> {
    const allMatches = await MatchModel.findAll({
      include: [
        { model: TeamModel, as: 'homeTeam', attributes: { exclude: ['id'] } },
        { model: TeamModel, as: 'awayTeam', attributes: { exclude: ['id'] } },
      ],
    });

    return allMatches;
  }

  public static async findMatchesInProgress(inProgress: boolean): Promise <MatchModel[]> {
    const matchesInProgress = await MatchModel.findAll({
      where: { inProgress },
      include: [
        { model: TeamModel, as: 'homeTeam', attributes: { exclude: ['id'] } },
        { model: TeamModel, as: 'awayTeam', attributes: { exclude: ['id'] } },
      ],
    });

    return matchesInProgress;
  }

  public static async saveMatchInProgress(matchData: IMatch) {
    const newMatch = await MatchModel.create({ ...matchData, inProgress: true });

    return newMatch;
  }
}
