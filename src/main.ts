/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();
import cors from 'cors';
const cookieParser = require('cookie-parser');
import mongoose from 'mongoose';
import { Express } from 'express';
import router from './router';
import express from 'express';
import errormiddleware from './middlewares/error.middleware';
import ILogger from './logger/logger.service.interface';
import LoggerService from './logger/logger.service';
import { TYPES } from './Types';
import { Container, ContainerModule, interfaces } from 'inversify';

const app: Express = express();
// const logger: ILogger = new LoggerService();

const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/api', router);
app.use(errormiddleware);

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService);
});

const start = async (): Promise<void> => {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const logger = appContainer.get<LoggerService>(TYPES.ILogger);

	try {
		await mongoose.connect(process.env.DB_URL as string);
		app.listen(PORT, () => logger.log('Сервер запущен'));
	} catch (e) {
		console.log(e);
	}
};

start();
