import { NextFunction, Request, Response } from 'express';

export default interface IUserController {
  registration: (req: Request, res: Response, next: NextFunction) => void;
  login: (req: Request, res: Response, next: NextFunction) => void;
  logout: (req: Request, res: Response, next: NextFunction) => void;
  activate: (req: Request, res: Response, next: NextFunction) => void;
  refresh: (req: Request, res: Response, next: NextFunction) => void;
  getUsers: (req: Request, res: Response, next: NextFunction) => void;
}
