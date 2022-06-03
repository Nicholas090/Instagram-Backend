import { NextFunction, Request, Response } from 'express';
import IUserController from './user.controller.interface';
import { validationResult } from 'express-validator';
import ApiError from '../exceptions/api.error';
import UserService from '../service/user-service';
import userService from '../service/user-service';
import LoggerService from '../logger/logger.service';
import ILogger from '../logger/logger.service.interface';

class UserController implements IUserController {
	logger: ILogger;
	constructor() {
		this.logger = new LoggerService();
	}
	async registration(req: Request, res: Response, next: NextFunction): Promise<object | void> {
		try {
			this.logger.log('Registartion');
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

	async login(req: Request, res: Response, next: NextFunction): Promise<any> {
		try {
			this.logger.log('login');
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

	async logout(req: Request, res: Response, next: NextFunction): Promise<any> {
		try {
			this.logger.log('logout');
			const { refreshToken } = req.cookies;
			const token = await UserService.logout(refreshToken);
			res.clearCookie('refreshToken');
			return res.json(token);
		} catch (e) {
			next(e);
		}
	}
	async activate(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			this.logger.log('Activate link');
			const activateLink = req.params.link;
			UserService.activate(activateLink);
			return res.redirect(process.env.CLIENT_URL as string);
		} catch (e) {
			next(e);
		}
	}
	async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			this.logger.log('Refresh Token');
			const { refreshToken } = req.cookies();
			const userData = await userService.refresh(refreshToken);
		} catch (e) {
			next(e);
		}
	}
	async getUsers(req: Request, res: Response, next: NextFunction): Promise<any> {
		try {
			this.logger.log('Get users');
			const users = await UserService.getAllUsers();
			return res.json(users);
		} catch (e) {
			next(e);
		}
	}
}

export default new UserController();
