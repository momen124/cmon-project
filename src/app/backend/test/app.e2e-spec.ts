import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';  // Default import (from previous fix)
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { PasswordResetToken } from '../src/entities/password-reset-token.entity';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let tokenRepository: Repository<PasswordResetToken>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
    tokenRepository = moduleFixture.get<Repository<PasswordResetToken>>(getRepositoryToken(PasswordResetToken));

    // FIXED: Use unique emails with timestamp
    const timestamp = Date.now();
    const uniqueAdminEmail = `admin-${timestamp}@example.com`;
    const uniqueUserEmail = `user-${timestamp}@example.com`;

    // Create admin user
    const hashedAdminPassword = await bcrypt.hash('adminpassword', 10);
    const admin = userRepository.create({ 
      email: uniqueAdminEmail,  // FIXED: Unique
      password: hashedAdminPassword, 
      role: 'admin', 
      name: 'Admin' 
    });
    await userRepository.save(admin);

    // Create regular user
    const hashedPassword = await bcrypt.hash('password', 10);
    const user = userRepository.create({ 
      email: uniqueUserEmail,  // FIXED: Unique
      password: hashedPassword, 
      name: 'User' 
    });
    await userRepository.save(user);

    // Authenticate as admin/user with unique emails
    const adminResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: uniqueAdminEmail, password: 'adminpassword' });
    const adminToken = adminResponse.body.access_token;

    const userResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: uniqueUserEmail, password: 'password' });
    const userToken = userResponse.body.access_token;

    // Store tokens for tests
    global.adminToken = adminToken;
    global.userToken = userToken;
    global.testUser = user;
  });

  afterEach(async () => {
    // OPTIONAL: Cleanup test data
    await userRepository.delete({ email: expect.any(String) });  // Delete all test users
    await tokenRepository.delete({});  // Delete tokens
    await app.close();
  });

  it('/auth/register (POST)', async () => {
    const uniqueId = Date.now();  // NEW: Unique for this test
    const createUserDto = { 
      email: `register-${uniqueId}@example.com`,  // FIXED: Unique for register test
      password: 'password', 
      name: 'Register Test' 
    };

    return request(app.getHttpServer())
      .post('/auth/register')
      .send(createUserDto)
      .expect(201)
      .expect(res => {
        expect(res.body.email).toBe(createUserDto.email);
      });
  });

  it('/auth/login (POST)', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: global.uniqueUserEmail, password: 'password' })  // Use unique from beforeEach
      .expect(200)
      .expect(res => {
        expect(res.body).toHaveProperty('access_token');
      });
  });

  it('/auth/forgot-password (POST)', async () => {
    return request(app.getHttpServer())
      .post('/auth/forgot-password')
      .send({ email: global.uniqueUserEmail })  // Use unique
      .expect(200)
      .expect(res => {
        expect(res.body.message).toContain('sent');
      });
  });

  it('/auth/reset-password (POST)', async () => {
    // Setup token for test
    const token = 'test-token';
    await tokenRepository.save(tokenRepository.create({ 
      user: global.testUser, 
      token, 
      expires_at: new Date(Date.now() + 3600000) 
    }));

    const resetPasswordDto = { token, newPassword: 'newpassword' };

    return request(app.getHttpServer())
      .post('/auth/reset-password')
      .send(resetPasswordDto)
      .expect(200)
      .expect(res => {
        expect(res.body.message).toBe('Password has been reset successfully.');
      });
  });
});