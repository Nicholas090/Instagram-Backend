import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
	email: { type: String, unique: true, required: true },
	password: { type: String, unique: false, required: true },
	userNickName: { type: String, unique: false, required: true },
	userName: { type: String, unique: false, required: true },
	isActivated: { type: Boolean, default: false },
	activationLink: { type: String },
});

export default model('User', UserSchema);
