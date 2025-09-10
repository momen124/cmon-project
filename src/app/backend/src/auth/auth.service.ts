import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from 'src/entities/user.entity';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
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
      // Don't reveal that the user doesn't exist
      return { message: 'If a user with this email exists, a password reset link has been sent.' };
    }
    const token = 'fake-reset-token'; // In a real app, generate a secure token
    await this.emailService.sendMail(
      user.email,
      'Password Reset Request',
      `Here is your password reset token: ${token}`,
    );
    return { message: 'If a user with this email exists, a password reset link has been sent.' };
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    // In a real app, validate the token and find the user.
    console.log(`Resetting password with token ${token}`);
    const user = await this.usersService.findOne('test@example.com'); // Dummy user for now
    if (user) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.usersService.update(user.id, { password: hashedPassword });
    }
    return { message: 'Password has been reset successfully.' };
  }
}
