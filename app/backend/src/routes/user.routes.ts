import { Router } from 'express';
import UserController from '../controller/User.controller';
import validateLoginDataMiddleware from '../middlewares/validateLoginData.middleware';
import validateTokenMiddleware from '../middlewares/validateToken.middleware';

const userRouter = Router();

userRouter.post(
  '/',
  validateLoginDataMiddleware,
  UserController.login,
);

userRouter.get(
  '/validate',
  validateTokenMiddleware,
  UserController.validateToken,
);

export default userRouter;
