import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import ApiError from '../exceptions/api.error';
import LoggerService from '../logger/logger.service';
import ILogger from '../logger/logger.service.interface';

export default function (err: any, req: Request, res: Response, next: NextFunction): any {
	const logger: ILogger = new LoggerService();
	console.log(err);

	if (err instanceof ApiError) {
		logger.warn();
		return res.status(err.status).json({ error: true, message: err.message, errors: err.err });
	}

	logger.warn();
	return res.status(500).json({ error: true, message: 'Не известная ошибка!' });
}
