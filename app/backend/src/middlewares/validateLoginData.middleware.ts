import { NextFunction, Request, Response } from 'express';
import HttpException from '../utils/httpException.util';

const validateLoginDataMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  const isDataMissing = !email || !password;
  if (isDataMissing) throw new HttpException(400, 'All fields must be filled');

  next();
};

export default validateLoginDataMiddleware;
