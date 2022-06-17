/* eslint-disable @typescript-eslint/no-var-requires */
import { Container, ContainerModule, interfaces } from 'inversify';
import ILogger from './logger/logger.service.interface';
import LoggerService from './logger/logger.service';
import IUserService from './service/interfaces/user.service.interface';
import { UserService } from './service/user-service';
import IUserController from './controllers/user.controller.interface';
import { TYPES } from './Types';
import UserController from './controllers/user.controller';
require('dotenv').config();
import cors from 'cors';
const cookieParser = require('cookie-parser');
import mongoose from 'mongoose';
import { Express } from 'express';
import routerFunc from './router';
import express from 'express';
import errormiddleware from './middlewares/error.middleware';
import ITokenService from './service/interfaces/token.service.interface';
import TokenService from './service/token-service';
import IMailService from './service/interfaces/mail.service.interface';
import MailService from './service/mail-service';

const app: Express = express();
export const appContainer = new Container();

const corsOptions = {
	origin: 'http://localhost:3000',
	credentials: true,
	optionSuccessStatus: 200,
};

const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService);
	bind<IUserController>(TYPES.UserController).to(UserController);
	bind<IUserService>(TYPES.UserService).to(UserService);
	bind<ITokenService>(TYPES.TokenService).to(TokenService);
	bind<IMailService>(TYPES.MailService).to(MailService);
});
appContainer.load(appBindings);

const logger = appContainer.get<ILogger>(TYPES.ILogger);
const userController = appContainer.get<IUserController>(TYPES.UserController);
const PORT = process.env.PORT;
const router = routerFunc(userController);
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use('/api', router);
app.use(errormiddleware);

const start = async (): Promise<void> => {
	try {
		await mongoose.connect(process.env.DB_URL as string);
		app.listen(PORT, () => logger.log('Сервер запущен'));
	} catch (e) {
		console.log(e);
	}
};

start();
