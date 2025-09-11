import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../entities/user.entity';
import { EmailService } from '../email/email.service';
import { PasswordResetToken } from 'src/entities/password-reset-token.entity';
export declare class AuthService {
    private usersService;
    private jwtService;
    private emailService;
    private passwordResetTokenRepository;
    constructor(usersService: UsersService, jwtService: JwtService, emailService: EmailService, passwordResetTokenRepository: Repository<PasswordResetToken>);
    validateUser(email: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
    }>;
    register(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
}
