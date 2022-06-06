import { JwtPayload, Secret, sign, verify } from 'jsonwebtoken';
import TokenModel from '../models/token.model';
import ITokenService from './interfaces/token.service.interface';

class TokenService implements ITokenService {
	generateToken(payload: any): { accessToken: string; refreshToken: string } {
		const accessToken = sign(payload, process.env.JWT_ACCESS_SECRET as Secret, {
			expiresIn: '30m',
		});
		const refreshToken = sign(payload, process.env.JWT_REFRESH_SECRET as Secret, {
			expiresIn: '30d',
		});
		return {
			accessToken,
			refreshToken,
		};
	}
	async saveToken(userId: string, refreshToken: string): Promise<void> {
		const tokenData = await TokenModel.findOne({ user: userId });

		if (tokenData) {
			tokenData.refreshToken = refreshToken;
			return tokenData.save();
		}
		await TokenModel.create({ user: userId, refreshToken });
	}

	validateAccessToken(token: string): string | JwtPayload | null {
		try {
			const userData = verify(token, process.env.JWT_ACCESS_SECRET as string);
			return userData;
		} catch (e) {
			return null;
		}
	}

	validateRefreshToken(token: string): string | JwtPayload | null {
		try {
			const userData = verify(token, process.env.JWT_REFRESH_SECRET as string);
			return userData;
		} catch (e) {
			console.log(e);
			return null;
		}
	}

	async findToken(refreshToken: string): Promise<object> {
		const tokenData = await TokenModel.findOne({ refreshToken });
		return tokenData;
	}

	async removeToken(refreshToken: string): Promise<object> {
		const tokenData = await TokenModel.deleteOne({ refreshToken });
		return tokenData;
	}
}

export default new TokenService();
