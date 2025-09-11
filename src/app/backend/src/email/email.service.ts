import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';

@Injectable()
export class EmailService {
  constructor(@InjectQueue('email') private emailQueue: Queue) {}

  async sendMail(to: string, subject: string, text: string) {
    await this.emailQueue.add('send-email', {
      to,
      subject,
      text,
    });
  }
}
