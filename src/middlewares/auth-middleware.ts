import { NextFunction, Request, Response } from 'express';
import ApiError from '../exceptions/api.error';
import { appContainer } from '../main';
import { TYPES } from '../Types';
import ITokenService from '../service/interfaces/token.service.interface';

export default function (req: Request, res: Response, next: NextFunction): void {
	const TokenService = appContainer.get<ITokenService>(TYPES.TokenService);
	try {
		const authorizationHeader = req.headers.authorization;
		if (!authorizationHeader) {
			return next(ApiError.UnauthorizedError());
		}

		const accessToken = authorizationHeader.split(' ')[1];
		if (!accessToken) {
			return next(ApiError.UnauthorizedError());
		}

		const userData = TokenService.validateAccessToken(accessToken);
		if (!userData) {
			return next(ApiError.UnauthorizedError());
		}
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		//@ts-ignore
		req.user = userData;
		next();
	} catch (e) {
		return next(ApiError.UnauthorizedError());
	}
}
