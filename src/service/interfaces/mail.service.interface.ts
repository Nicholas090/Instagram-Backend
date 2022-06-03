import { Transporter } from 'nodemailer';

export default interface IMailService {
	transporter: Transporter;
	sendActivationMail: (to: string, link: string) => void;
}
