import { NextFunction, Request, Response } from 'express';
import { validateTokenUtil } from '../utils/jwt.util';

const validateTokenMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  // await adcionado para que o teste funcione; apesar do VSCode avisando que o await aqui é desnecessário, no .log do teste essa função retonrava uma promise
  const { role } = await validateTokenUtil(authorization);
  req.body.role = role;

  next();
};

export default validateTokenMiddleware;
