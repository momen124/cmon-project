import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../entities/user.entity';
import { EmailService } from '../email/email.service';
import { PasswordResetToken } from '../entities/password-reset-token.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
    @InjectRepository(PasswordResetToken)
    private passwordResetTokenRepository: Repository<PasswordResetToken>,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const { email, password, name } = createUserDto;

    const existingUser = await this.usersService.findOne(email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await this.usersService.create({
      email,
      password: hashedPassword,
      name,
    });

    await this.emailService.sendMail(
      user.email,
      'Welcome to Our App!',
      `Hello ${user.name}, welcome to our application!`,
    );

    // Exclude password from the returned user object
    const { password: _, ...result } = user;
    return result;
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.usersService.findOne(email);
    if (!user) {
      return { message: 'If a user with this email exists, a password reset link has been sent.' };
    }

    const existingToken = await this.passwordResetTokenRepository.findOne({ where: { user: { id: user.id } } });
    if (existingToken) {
        await this.passwordResetTokenRepository.remove(existingToken);
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires_at = new Date();
    expires_at.setHours(expires_at.getHours() + 1); // Token expires in 1 hour

    const resetToken = this.passwordResetTokenRepository.create({
      user,
      token,
      expires_at,
    });

    await this.passwordResetTokenRepository.save(resetToken);

    await this.emailService.sendMail(
      user.email,
      'Password Reset Request',
      `Here is your password reset token: ${token}`,
    );

    return { message: 'If a user with this email exists, a password reset link has been sent.' };
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const resetToken = await this.passwordResetTokenRepository.findOne({ where: { token }, relations: ['user'] });

    if (!resetToken || resetToken.expires_at < new Date()) {
      throw new UnauthorizedException('Invalid or expired password reset token');
    }

    const { user } = resetToken;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersService.update(user.id, { password: hashedPassword });
    await this.passwordResetTokenRepository.remove(resetToken);

    return { message: 'Password has been reset successfully.' };
  }
}
