import IMatch, { IMatchGoals } from '../interfaces/IMatch';
import MatchModel from '../database/models/MatchModel';
import TeamModel from '../database/models/TeamModel';
import HttpException from '../utils/httpException.util';

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

  public static async updateMatchToFinished(id: number): Promise<void> {
    await MatchModel.update({ inProgress: false }, { where: { id } });
  }

  public static async validateMatchTeams(homeTeamId: number, awayTeamId: number) {
    const isSameTeam = homeTeamId === awayTeamId;
    if (isSameTeam) {
      throw new HttpException(
        422,
        'It is not possible to create a match with two equal teams',
      );
    }

    const findHomeTeam = await TeamModel.findByPk((homeTeamId));
    const findAwayTeam = await TeamModel.findByPk(awayTeamId);

    const isEitherTeamNotFound = !findHomeTeam || !findAwayTeam;
    if (isEitherTeamNotFound) {
      throw new HttpException(404, 'There is no team with such id!');
    }
  }

  public static async saveMatchInProgress(matchData: IMatch): Promise<IMatch> {
    const { homeTeamId, awayTeamId } = matchData;

    await this.validateMatchTeams(homeTeamId, awayTeamId);
    const newMatch = await MatchModel.create({ ...matchData, inProgress: true });

    return newMatch;
  }

  public static async updateMatchGoals(id: number, newMatchGoals: IMatchGoals): Promise<void> {
    await MatchModel.update({ ...newMatchGoals }, { where: { id } });
  }
}
