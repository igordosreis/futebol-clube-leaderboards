import * as bcryptjs from 'bcryptjs';
import HttpException from './httpException.util';

const validatePasswordUtil = (reqPassword: string, recoveredPassword: string): void => {
  const isInvalid = !bcryptjs.compareSync(reqPassword, recoveredPassword);

  if (isInvalid) throw new HttpException(401, 'Incorrect email or password');
};

export default validatePasswordUtil;
