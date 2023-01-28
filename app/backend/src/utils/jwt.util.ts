import * as jwt from 'jsonwebtoken';
import IUser from '../interfaces/IUser';
import HttpException from './httpException.util';

const createTokenUtil = (user: Partial<IUser>): string => {
  const { id, role } = user;
  const token = jwt.sign(
    { id, role },
    process.env.JWT_SECRET as string,
    { algorithm: 'HS256', expiresIn: '1d' },
  );

  return token;
};

const validateTokenUtil = (token: string | undefined): Partial<IUser> => {
  const isTokenMissing = !token;
  if (isTokenMissing) throw new HttpException(404, 'Token missing');

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET as string);

    return user as Partial<IUser>;
  } catch (error) {
    throw new HttpException(401, 'Invalid token');
  }
};

export {
  createTokenUtil,
  validateTokenUtil,
};
