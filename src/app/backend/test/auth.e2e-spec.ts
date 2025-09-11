import { getRepositoryToken } from '@nestjs/typeorm';
import { PasswordResetToken } from '../src/entities/password-reset-token.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { app, userRepository } from './setup-e2e';

import request from 'supertest';
describe('AuthController (e2e)', () => {
  let tokenRepository: Repository<PasswordResetToken>;

  beforeAll(() => {
    tokenRepository = app.get<Repository<PasswordResetToken>>(getRepositoryToken(PasswordResetToken));
  });

  beforeEach(async () => {
    // Clean up tokens as well
    await tokenRepository.delete({});
  });

  it('/auth/register (POST)', async () => {
    const createUserDto = { email: 'test@test.com', password: 'password', name: 'Test' };

    return request(app.getHttpServer())
      .post('/auth/register')
      .send(createUserDto)
      .expect(201)
      .expect(res => {
        expect(res.body.email).toBe('test@test.com');
      });
  });

  it('/auth/login (POST)', async () => {
    const password = 'password';
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = userRepository.create({ email: 'test@test.com', password: hashedPassword, name: 'Test' });
    await userRepository.save(user);

    const loginDto = { email: 'test@test.com', password: 'password' };

    return request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(201)
      .expect(res => {
        expect(res.body).toHaveProperty('access_token');
      });
  });

  it('/auth/forgot-password (POST)', async () => {
    const user = userRepository.create({ email: 'test@test.com', password: 'password', name: 'Test' });
    await userRepository.save(user);

    return request(app.getHttpServer())
      .post('/auth/forgot-password')
      .send({ email: 'test@test.com' })
      .expect(201)
      .expect(res => {
        expect(res.body.message).toBe('If a user with this email exists, a password reset link has been sent.');
      });
  });

  it('/auth/reset-password (POST)', async () => {
    const user = await userRepository.save(userRepository.create({ email: 'test@test.com', password: 'password', name: 'Test' }));
    const tokenEntity = await tokenRepository.save(tokenRepository.create({ user, token: 'test-token', expires_at: new Date(Date.now() + 3600000) }));

    const resetPasswordDto = { token: 'test-token', password: 'newpassword' };

    return request(app.getHttpServer())
      .post('/auth/reset-password')
      .send(resetPasswordDto)
      .expect(201)
      .expect(res => {
        expect(res.body.message).toBe('Password has been reset successfully.');
      });
  });
});