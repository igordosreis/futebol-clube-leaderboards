import ITeam from '../interfaces/ITeam';
import TeamModel from '../database/models/TeamModel';

export default class Team {
  public static async findAllTeams(): Promise<ITeam[]> {
    const allTeams = TeamModel.findAll();

    return allTeams;
  }
}
