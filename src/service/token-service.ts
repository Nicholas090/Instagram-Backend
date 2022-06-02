import { Secret, sign } from 'jsonwebtoken';
import TokenModel from '../models/token.model';
import ITokenService from './interfaces/token.service.interface';

class TokenService implements ITokenService {
  constructor() {}
  generateToken(payload: any) {
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
  async saveToken(userId: string, refreshToken: string) {
    const tokenData = await TokenModel.findOne({ user: userId });
    console.log('Я тут 1');

    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    await TokenModel.create({ user: userId, refreshToken });
  }

  async removeToken(refreshToken: string) {
    const tokenData = await TokenModel.deleteOne({ refreshToken });
    return refreshToken;
  }
}

export default new TokenService();
