import IUser from '../interfaces/IUser';
import HttpException from './httpException.util';

const validateEmailUtil = (user: IUser | null): IUser => {
  const isNotFound = !user;
  if (isNotFound) throw new HttpException(401, 'Incorrect email or password');

  return user;
};

export default validateEmailUtil;
