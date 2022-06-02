import { NextFunction, Request, Response } from 'express';
import IUserController from './user.controller.interface';
import { validationResult } from 'express-validator';
import ApiError from '../exceptions/api.error';
import UserService from '../service/user-service';

class UserController implements IUserController {
  constructor() {}
  async registration(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Ошибка валидации', errors.array));
      }
      const { email, password, userNickName, userName } = req.body;
      const userData = await UserService.registration(email, password, userNickName, userName);
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 68 * 68 * 1000,
        httpOnly: true,
      });

      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const userData = await UserService.login(email, password);
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 68 * 68 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      const token = await UserService.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.json(token);
    } catch (e) {
      next(e);
    }
  }
  async activate(req: Request, res: Response, next: NextFunction) {
    try {
      const activateLink = req.params.link;
      UserService.activate(activateLink);

      return res.redirect(process.env.CLIENT_URL as string);
    } catch (e) {
      next(e);
    }
  }
  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
    } catch (e) {
      next(e);
    }
  }
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(['123', '456']);
    } catch (e) {
      next(e);
    }
  }
}

export default new UserController();
