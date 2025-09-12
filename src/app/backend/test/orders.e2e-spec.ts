import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import  request from 'supertest';
import { setupTestApp } from './setup-e2e'; // Adjust path
import { OrdersModule } from '../src/orders/orders.module';
import { getRepositoryToken } from '@nestjs/typeorm';

import { DataSource } from 'typeorm';
import { Order } from 'src/entities/order.entity';
import { User } from 'src/entities/user.entity';

describe('OrdersController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let orderRepository: any;
  let userRepository: any;

  beforeAll(async () => {
    const { app: testApp, dataSource: ds } = await setupTestApp();
    app = testApp;
    dataSource = ds;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [OrdersModule],
    }).compile();

    orderRepository = moduleFixture.get(getRepositoryToken(Order));
    userRepository = moduleFixture.get(getRepositoryToken(User));
  });

  beforeEach(async () => {
    try {
      await orderRepository.clear();
      await userRepository.clear();
      await userRepository.save({
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashed_password',
      });
      await orderRepository.save({
        user: { id: 1 }, // Adjust based on your entity relations
        total: 100,
      });
    } catch (error) {
      if (error.message.includes('relation does not exist')) {
        console.log('Table not found during clear, assuming sync handled it');
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

  it('/orders (POST)', () => {
    return request(app.getHttpServer())
      .post('/orders')
      .send({ userId: 1, total: 200 })
      .expect(201)
      .expect((res) => {
        expect(res.body.total).toBe(200);
      });
  });

  it('/orders/user (GET)', () => {
    return request(app.getHttpServer())
      .get('/orders/user')
      .set('Authorization', 'Bearer test_token') // Adjust for auth
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });

  it('/orders/admin (GET)', () => {
    return request(app.getHttpServer())
      .get('/orders/admin')
      .set('Authorization', 'Bearer admin_token') // Adjust for auth
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });
});