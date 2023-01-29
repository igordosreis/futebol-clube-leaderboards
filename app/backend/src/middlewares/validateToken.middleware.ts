import { NextFunction, Request, Response } from 'express';
import { validateTokenUtil } from '../utils/jwt.util';

const validateTokenMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  const { role } = validateTokenUtil(authorization);
  req.body.role = role;

  next();
};

export default validateTokenMiddleware;
