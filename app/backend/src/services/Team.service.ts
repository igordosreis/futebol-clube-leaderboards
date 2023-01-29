import ITeam from '../interfaces/ITeam';
import TeamModel from '../database/models/TeamModel';
import HttpException from '../utils/httpException.util';

export default class Team {
  public static async findAllTeams(): Promise<ITeam[]> {
    const allTeams: ITeam[] = await TeamModel.findAll();

    return allTeams;
  }

  public static async findTeamById(id: number): Promise<ITeam> {
    const team: ITeam | null = await TeamModel.findByPk(id);

    const isNotFound = !team;
    if (isNotFound) throw new HttpException(401, 'Team not found');

    return team;
  }
}
