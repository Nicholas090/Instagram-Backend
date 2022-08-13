import UserModel from '../models/user.model';
import bcrypt from 'bcrypt';
import { v4 } from 'uuid';
import UserDto from '../dto/user.dto';
import IUserService, { IUserServiceReturn } from './interfaces/user.service.interface';
import ApiError from '../exceptions/api.error';
import { inject, injectable } from 'inversify';
import { TYPES } from '../Types';
import ITokenService from './interfaces/token.service.interface';
import IMailService from './interfaces/mail.service.interface';
import 'reflect-metadata';
import {getUsersDto} from "../dto/getUsersDto";

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.TokenService) private TokenService: ITokenService,
		@inject(TYPES.MailService) private MailService: IMailService,
	) {}
	async registration(
		email: string,
		password: string,
		userNickName: string,
		userName: string,
	): Promise<IUserServiceReturn | any> {
		const candidate = await UserModel.findOne({ email });
		if (candidate) {
			ApiError.BadRequest(`Пользователь с таким Email ${email} уже существует`);
		}
		const hashPassword = await bcrypt.hash(password, 3);
		const activationLink = await v4();
		const user = await UserModel.create({
			email,
			password: hashPassword,
			userNickName,
			userName,
			activationLink,
		});
		await this.MailService.sendActivationMail(
			email,
			`${process.env.API_URL}/api/activate/${activationLink}`,
		);
		const userDto = new UserDto(user);
		const tokens = this.TokenService.generateToken({ ...userDto });
		await this.TokenService.saveToken(userDto.id, tokens.refreshToken);

		return {
			...tokens,
			user: userDto,
		};
	}

	async activate(activationLink: string): Promise<void> {
		const user = await UserModel.findOne({ activationLink });
		if (user) {
			user.isActivated = true;
			await user.save();
		}else {
			ApiError.BadRequest('Некоректная ссылка активации');
		}


	}

	async login(email: string, password: string): Promise<IUserServiceReturn> {
		const user = await UserModel.findOne({ email });
		if (!user) {
			ApiError.BadRequest('Пользователя с таким email нет');
		}
		const isPassEqual = await bcrypt.compare(password, user!.password);
		if (!isPassEqual) {
			ApiError.BadRequest(
				'К сожалению, вы ввели неправильный пароль. Проверьте свой пароль еще раз.',
			);
		}

		const userDto = new UserDto(user);

		const tokens = this.TokenService.generateToken({ ...userDto });

		await this.TokenService.saveToken(userDto.id, tokens.refreshToken);
		return {
			...tokens,
			user: userDto,
		};
	}

	async logout(refreshToken: string): Promise<object> {
		const token = await this.TokenService.removeToken(refreshToken);
		return token;
	}

	async refresh(refreshToken: string): Promise<IUserServiceReturn> {
		if (!refreshToken) {
			ApiError.UnauthorizedError();
		}
		const userData = this.TokenService.validateRefreshToken(refreshToken);
		const user = await UserModel.findById((userData as any).id);

		const tokenFromDb = await this.TokenService.findToken(refreshToken);
		if (!userData || !tokenFromDb || !user) {
			ApiError.UnauthorizedError();
		}

		const userDto = new UserDto(user);

		const tokens = this.TokenService.generateToken({ ...userDto });

		await this.TokenService.saveToken(userDto.id, tokens.refreshToken);
		return {
			...tokens,
			user: userDto,
		};
	}

	async getAllUsers(): Promise<any> {
		const users = await UserModel.find();
		return getUsersDto(users);
	}
}
// export  UserService;
