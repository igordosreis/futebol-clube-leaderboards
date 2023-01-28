import { Router } from 'express';
import UserController from '../controller/User.controller';
import validateLoginDataMiddleware from '../middlewares/validateLoginData.middleware';
import validateTokenMiddleware from '../middlewares/validateToken.middleware';

const userRouter = Router();

// const userController = new UserController();

userRouter.post(
  '/',
  validateLoginDataMiddleware,
  // (req, res) => userController.login(req, res), // Caso o metodo em controller use arrow function, essa sintaxe tem que ser usada no router
  UserController.login,
);

userRouter.get(
  '/validate',
  validateTokenMiddleware,
  UserController.validateToken,
);

export default userRouter;
