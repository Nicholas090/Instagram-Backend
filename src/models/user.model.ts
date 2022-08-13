import { Schema, model } from 'mongoose';

export interface IUserModel {
	email: string,
	password: string,
	userNickName: string,
	userName: string,
	isActivated: boolean,
	activationLink: string | null | undefined,
}

const UserSchema = new Schema<IUserModel>({
	email: { type: String, unique: true, required: true },
	password: { type: String, unique: false, required: true },
	userNickName: { type: String, unique: false, required: true },
	userName: { type: String, unique: false, required: true },
	isActivated: { type: Boolean, default: false },
	activationLink: { type: String },
});

export default model('User', UserSchema);
