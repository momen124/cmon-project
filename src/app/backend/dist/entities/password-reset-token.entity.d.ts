import { User } from './user.entity';
export declare class PasswordResetToken {
    id: string;
    token: string;
    user: User;
    expires_at: Date;
}
