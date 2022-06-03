import UserDto from '../../dto/user.dto';

export default interface IUserService {
	registration: (
		email: string,
		password: string,
		userNickName: string,
		userName: string,
	) => Promise<IUserServiceReturn>;
	activate: (activationLink: string) => Promise<void>;
	login: (email: string, password: string, userNickName?: string) => Promise<IUserServiceReturn>;
	logout: (refreshToken: string) => Promise<object>;
	refresh: (refreshToken: string) => Promise<IUserServiceReturn>;
	getAllUsers: () => Promise<any>;
}

export interface IUserServiceReturn {
	refreshToken: string;
	accessToken: string;
	user: UserDto;
}
