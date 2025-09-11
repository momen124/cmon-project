import { Processor, Process } from '@nestjs/bull';
import type { Job } from 'bull';
import { Logger } from '@nestjs/common';

@Processor('email')
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);

  @Process('send-email')
  handleSendEmail(job: Job) {
    this.logger.log('Starting email sending job...');
    this.logger.log('Job data:', JSON.stringify(job.data, null, 2));
    // This is where the actual email sending logic would go (e.g., using SendGrid, Nodemailer, etc.)
    // For now, we just log the job data.
    this.logger.log('Email sending job completed.');
  }
}
