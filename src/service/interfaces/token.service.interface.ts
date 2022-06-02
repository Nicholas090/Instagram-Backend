interface Itokens {
  accessToken: string;
  refreshToken: string;
}

export default interface ITokenService {
  generateToken: (payload: any) => Itokens;
  saveToken: (userId: string, refreshToken: any) => any;
  removeToken: (refreshToken: string) => any;
}
