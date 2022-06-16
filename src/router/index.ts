import { NextFunction, Request, Response, Router } from 'express';
import authMiddleware from '../middlewares/auth-middleware';
import IUserController from '../controllers/user.controller.interface';
import { createUserValid } from '../middlewares/registration.validator.middleware';

function routerFunc(UserController: IUserController) {
	const router: Router = Router();

	router.post('/registration', createUserValid, UserController.registration.bind(UserController));
	router.post('/login', UserController.login.bind(UserController));
	router.post('/logout', UserController.logout.bind(UserController));
	router.get('/activate/:link', UserController.activate.bind(UserController));
	router.get('/refresh', UserController.refresh.bind(UserController));
	router.get('/users', authMiddleware, UserController.getUsers.bind(UserController));

	return router;
}
export default routerFunc;
