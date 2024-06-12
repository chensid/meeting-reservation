import { Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter: Transporter;
  constructor(private configService: ConfigService) {
    this.transporter = createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: false,
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    });
  }

  async sendEmail({ to, subject, html }) {
    return this.transporter.sendMail({
      from: {
        name: this.configService.get<string>('MAIL_FROM_NAME'),
        address: this.configService.get<string>('MAIL_USER'),
      },
      to,
      subject,
      html,
    });
  }
}
