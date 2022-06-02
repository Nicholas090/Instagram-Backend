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

  static UnauthorizedError() {
    return new ApiError(402, 'Пользователь не авторизован', []);
  }

  static BadRequest(message: any, err?: any) {
    return new ApiError(401, message, err);
  }
}
