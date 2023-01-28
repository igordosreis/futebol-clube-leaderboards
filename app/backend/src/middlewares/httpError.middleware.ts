import { NextFunction, Request, Response } from 'express';
import HttpException from '../utils/httpException.util';

const httpErrorMiddleware = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  console.log('Error: ', error);
  const { status, message } = error as HttpException;

  res.status(status || 500).json({ message });
};

export default httpErrorMiddleware;
