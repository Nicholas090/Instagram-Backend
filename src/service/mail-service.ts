import IMailService from './interfaces/mail.service.interface';
import nodemailer, { Transporter } from 'nodemailer';

class MailService implements IMailService {
  transporter: Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      //@ts-ignore
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }
  async sendActivationMail(to: string, link: string) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to: to,
      subject: 'Test activation',
      text: 'no',
      html: ` <div>
          <h1>Для активации перейдите по ссылке</h1>
          <a href="${link}">${link}</a>
          </div>
        `,
    });
  }
}

export default new MailService();
