/* eslint-disable @typescript-eslint/no-var-requires */
import IUserController from './controllers/user.controller.interface';

require('dotenv').config();
import cors from 'cors';
const cookieParser = require('cookie-parser');
import mongoose from 'mongoose';
import { Express } from 'express';
import routerFunc from './router';
import express from 'express';
import errormiddleware from './middlewares/error.middleware';
import ILogger from './logger/logger.service.interface';
import LoggerService from './logger/logger.service';
import { TYPES } from './Types';
import { Container, ContainerModule, interfaces } from 'inversify';
import UserController from './controllers/user.controller';

const app: Express = express();
export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService);
	bind<IUserController>(TYPES.UserController).to(UserController);
});
const appContainer = new Container();
appContainer.load(appBindings);

const logger = appContainer.get<LoggerService>(TYPES.ILogger);
const userController = appContainer.get<UserController>(TYPES.UserController);
const PORT = process.env.PORT;
const router = routerFunc(userController);
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/api', router as any);
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
