import { NextFunction, Request, Response, Router } from 'express';
import UserController from '../controllers/user.controller';
import { body } from 'express-validator';

const router: Router = Router();

router.post(
  '/registration',
  body('email').isEmail(),
  body('password').isLength({ min: 8, max: 30 }),
  UserController.registration,
);

router.post('/login', UserController.login);
router.post('/logout', UserController.logout);
router.get('/activate/:link', UserController.activate);
router.get('/refresh', UserController.refresh);
router.get('/users', UserController.getUsers);

export default router;
