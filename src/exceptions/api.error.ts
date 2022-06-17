export default class ApiError extends Error {
	status: number;
	err: any;

	constructor(status: number, message: any, err: any = []) {
		super(message);
		this.status = status;
	}

	static UnauthorizedError(): ApiError {
		throw new ApiError(404, 'Пользователь не авторизован', []);
	}

	static BadRequest(message: any, err?: any): ApiError {
		throw new ApiError(401, message, err);
	}

	static validationUserError(message: string, err?: any): ApiError {
		throw new ApiError(401, message, err);
	}
}
