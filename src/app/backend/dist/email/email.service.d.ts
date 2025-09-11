import type { Queue } from 'bull';
export declare class EmailService {
    private emailQueue;
    constructor(emailQueue: Queue);
    sendMail(to: string, subject: string, text: string): Promise<void>;
}
