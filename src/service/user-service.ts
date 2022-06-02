import UserModel from '../models/user.model';
import bcrypt from 'bcrypt';
import { v4 } from 'uuid';
import MailService from './mail-service';
import UserDto from '../dto/user.dto';
import IUserService, { IUserServiceReturn } from './interfaces/user.service.interface';
import ApiError from '../exceptions/api.error';
import TokenService from './token-service';
class UserService implements IUserService {
  constructor() {}

  async registration(
    email: string,
    password: string,
    userNickName: string,
    userName: string,
  ): Promise<IUserServiceReturn> {
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
    await MailService.sendActivationMail(
      email,
      `${process.env.API_URL}/api/activate/${activationLink}`,
    );
    const userDto = new UserDto(user);
    const tokens = TokenService.generateToken({ ...userDto });
    await TokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }

  async activate(activationLink: string): Promise<void> {
    const user = await UserModel.findOne({ activationLink });
    if (!user) {
      ApiError.BadRequest('Некоректная ссылка активации');
    }

    user.isActivated = true;
    await user.save();
  }

  async login(email: string, password: string): Promise<IUserServiceReturn> {
    const user = await UserModel.findOne({ email });
    if (!user) {
      ApiError.BadRequest('Пользователя с таким email нет');
    }
    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      ApiError.BadRequest('Пароль неверный');
    }

    const userDto = new UserDto(user);

    const tokens = TokenService.generateToken({ ...userDto });

    await TokenService.saveToken(userDto.id, tokens.refreshToken);
    return {
      ...tokens,
      user: userDto,
    };
  }

  async logout(refreshToken: string): Promise<string> {
    const token = await TokenService.removeToken(refreshToken);
    return token;
  }
}
export default new UserService();
