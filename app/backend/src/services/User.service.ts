import HttpException from '../utils/httpException.util';
import UserModel from '../database/models/UserModel';
import IUser from '../interfaces/IUser';
import validatePasswordUtil from '../utils/bcrypt.util';
import { createTokenUtil } from '../utils/jwt.util';

export default class UserService {
  public static async login(user: IUser): Promise<Partial<IUser>> {
    const userRecovered = await UserModel.findOne({ where: { email: user.email } });

    const isNotFound = !userRecovered;
    if (isNotFound) throw new HttpException(401, 'Incorrect email or password');

    validatePasswordUtil(user.password, userRecovered.password);

    const token = createTokenUtil(userRecovered);

    const userToReq = {
      id: userRecovered.id,
      username: userRecovered.username,
      email: userRecovered.email,
      role: userRecovered.role,
      token };

    return userToReq;
  }
}
