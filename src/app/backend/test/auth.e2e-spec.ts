import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import  request from 'supertest';
import { setupTestApp } from './setup-e2e'; // Adjust path
import { AuthModule } from '../src/auth/auth.module';
import { getRepositoryToken } from '@nestjs/typeorm';

import { DataSource } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { PasswordResetToken } from 'src/entities/password-reset-token.entity';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let userRepository: any;
  let passwordResetTokenRepository: any;

  beforeAll(async () => {
    const { app: testApp, dataSource: ds } = await setupTestApp();
    app = testApp;
    dataSource = ds;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    userRepository = moduleFixture.get(getRepositoryToken(User));
    passwordResetTokenRepository = moduleFixture.get(getRepositoryToken(PasswordResetToken));
  });

  beforeEach(async () => {
    try {
      await userRepository.clear();
      await passwordResetTokenRepository.clear();
      await userRepository.save({
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashed_password',
      });
    } catch (error) {
      if (error.message.includes('relation does not exist')) {
        console.log('Table not found during clear, assuming sync handled it');
      } else {
        throw error;
      }
    }
  });

  afterEach(async () => {
    try {
      await userRepository.clear();
      await passwordResetTokenRepository.clear();
    } catch (error) {
      if (error.message.includes('relation does not exist')) {
        console.log('Cleanup error ignored:', error.message);
      } else {
        throw error;
      }
    }
  });

  afterAll(async () => {
    await app.close();
    try {
      await dataSource.dropDatabase();
      console.log('Test database dropped successfully');
    } catch (error) {
      console.log('Error dropping database:', error.message);
    }
  });

  it('/auth/register (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({ username: 'newuser', email: 'new@example.com', password: 'password' })
      .expect(201)
      .expect((res) => {
        expect(res.body.username).toBe('newuser');
      });
  });

  it('/auth/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password' })
      .expect(200)
      .expect((res) => {
        expect(res.body.token).toBeDefined();
      });
  });

  it('/auth/forgot-password (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/forgot-password')
      .send({ email: 'test@example.com' })
      .expect(200);
  });

  it('/auth/reset-password (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/reset-password')
      .send({ token: 'test_token', newPassword: 'newpassword' })
      .expect(200);
  });
});