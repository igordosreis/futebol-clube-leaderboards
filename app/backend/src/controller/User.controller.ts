import { Request, Response } from 'express';
import UserService from '../services/User.service';

export default class UserController {
  public static async login(req: Request, res: Response) {
    const loginData = req.body;

    const token = await UserService.login(loginData);

    res.status(200).json({ token });
  }

  public static async validateToken(req: Request, res: Response) {
    const { role } = req.body;

    res.status(200).json({ role });
  }
}
