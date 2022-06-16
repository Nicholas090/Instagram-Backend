import { NextFunction, Request, Response } from 'express';
import user from '../models/userModel';
import ApiError from '../exceptions/api.error';
const createUserValid = (req: Request, res: Response, next: NextFunction): any => {
	const body = req.body;
	const errors: string[] = [];

	Object.keys(user).forEach((key) => {
		// eslint-disable-next-line no-prototype-builtins
		if (!body.hasOwnProperty(key)) {
			errors.push(`Request body doesn't have ${key} property !`);
		}
	});

	Object.keys(body).forEach((e) => {
		// eslint-disable-next-line no-prototype-builtins
		if (!user.hasOwnProperty(e)) {
			errors.push(`User model doesn't have ${e} property !`);
		}
		if (e === 'email') {
			const reqExEmail = /^[a-z0-9](\.?[a-z0-9]){1,}@ukr\.net$/;
			if (!reqExEmail.test(body[e])) {
				errors.push(`email is incorrect`);
			}
		}

		if (e === 'password') {
			if (body[e].length < 3) {
				errors.push(`password length should be longer than 3 symbols!`);
			}
		}

		if (e === 'userName') {
			if (body[e].userName < 4) {
				errors.push(`lastName length should be longer than 4 symbols!`);
			}
		}

		if (e === 'userNickName') {
			if (body[e].length < 4) {
				errors.push(`userNickName length should be longer than 4 symbols!`);
			}
		}
	});

	if (errors.length !== 0) {
		console.log(errors);
		ApiError.validationUserError(errors[0]);
	}

	next();
};
//
// const updateUserValid = (req: Request, res: Response, next: NextFunction) => {
// 	const body = req.body;
// 	let errors = [];
// 	if (body.hasOwnProperty('id')) {
// 		errors.push("Request body shouldn't have (id) property !");
// 	}
//
// 	Object.keys(body).forEach((e) => {
// 		if (!user.hasOwnProperty(e)) {
// 			errors.push(`User model doesn't have ${e} property !`);
// 		}
// 		if (e === 'email') {
// 			let reqExEmail = /^[a-z0-9](\.?[a-z0-9]){1,}@gmail\.com$/;
// 			if (!reqExEmail.test(body[e])) {
// 				errors.push(`Email is incorrect`);
// 			}
// 		}
//
// 		if (e === 'phoneNumber') {
// 			let regExPhone = /^\+380(\d{9})$/;
// 			if (!regExPhone.test(body[e])) {
// 				errors.push(`Phone number is incorrect`);
// 			}
// 		}
// 		if (e === 'password') {
// 			if (body[e].length < 3) {
// 				errors.push(`Password length should be longer than 3 symbols!`);
// 			}
// 		}
//
// 		if (e === 'firstName') {
// 			if (body[e].length < 2) {
// 				errors.push(`firstName length should be longer than 2 symbols!`);
// 			}
// 		}
//
// 		if (e === 'lastName') {
// 			if (body[e].length < 4) {
// 				errors.push(`firstName length should be longer than 4 symbols!`);
// 			}
// 		}
// 	});
// 	let count = 0;
//
// 	Object.keys(user).forEach((key) => {
// 		if (body.hasOwnProperty(key)) {
// 			count += 1;
// 		}
// 	});
// 	if (count === 0) {
// 		errors.push(`Request body doesn't have any properties !`);
// 	}
// 	console.log(count);
//
// 	next();
// };

export { createUserValid };
