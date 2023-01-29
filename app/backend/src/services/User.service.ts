import UserModel from '../database/models/UserModel';
import IUser, { IUserLogin } from '../interfaces/IUser';
import validatePasswordUtil from '../utils/bcrypt.util';
import validateEmailUtil from '../utils/validateEmail.util';
import { createTokenUtil } from '../utils/jwt.util';

export default class UserService {
  public static async login(user: IUserLogin): Promise<string> {
    const userFetchResult: IUser | null = await UserModel.findOne({ where: { email: user.email } });

    const userFromDb: IUser = validateEmailUtil(userFetchResult);
    validatePasswordUtil(user.password, userFromDb.password);

    const token = createTokenUtil(userFromDb);

    return token;
  }
}
