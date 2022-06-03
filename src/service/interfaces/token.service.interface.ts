import { JwtPayload } from 'jsonwebtoken';

interface Itokens {
	accessToken: string;
	refreshToken: string;
}

export default interface ITokenService {
	generateToken: (payload: any) => Itokens;
	saveToken: (userId: string, refreshToken: any) => any;
	removeToken: (refreshToken: string) => object;
	findToken: (refreshToken: string) => object;
	validateAccessToken: (token: string) => string | JwtPayload | null;
	validateRefreshToken: (token: string) => string | JwtPayload | null;
}
