import type { Job } from 'bull';
export declare class EmailProcessor {
    private readonly logger;
    handleSendEmail(job: Job): void;
}
