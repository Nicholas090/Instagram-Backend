import { inject, injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export default class ApiError extends Error {
	status: number;
	err: any;

	constructor(status: number, message: any, err: any = []) {
		super(message);
		this.status = status;
	}

	static UnauthorizedError(): ApiError {
		return new ApiError(402, 'Пользователь не авторизован', []);
	}

	static BadRequest(message: any, err?: any): ApiError {
		return new ApiError(401, message, err);
	}
}
