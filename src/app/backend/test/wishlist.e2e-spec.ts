import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import  request from 'supertest';
import { setupTestApp } from './setup-e2e'; // Adjust path
import { WishlistModule } from '../src/wishlist/wishlist.module';
import { getRepositoryToken } from '@nestjs/typeorm';

import { DataSource } from 'typeorm';
import { Wishlist } from 'src/entities/wishlist.entity';
import { User } from 'src/entities/user.entity';
import { Product } from 'src/entities/product.entity';

describe('WishlistController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let wishlistRepository: any;
  let userRepository: any;
  let productRepository: any;

  beforeAll(async () => {
    const { app: testApp, dataSource: ds } = await setupTestApp();
    app = testApp;
    dataSource = ds;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [WishlistModule],
    }).compile();

    wishlistRepository = moduleFixture.get(getRepositoryToken(Wishlist));
    userRepository = moduleFixture.get(getRepositoryToken(User));
    productRepository = moduleFixture.get(getRepositoryToken(Product));
  });

  beforeEach(async () => {
    try {
      await wishlistRepository.clear();
      await userRepository.clear();
      await productRepository.clear();
      await userRepository.save({
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashed_password',
      });
      await productRepository.save({
        name: 'Test Product',
        price: 100,
      });
      await wishlistRepository.save({
        user: { id: 1 },
        product: { id: 1 },
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

  it('/wishlist (POST)', () => {
    return request(app.getHttpServer())
      .post('/wishlist')
      .send({ userId: 1, productId: 1 })
      .expect(201)
      .expect((res) => {
        expect(res.body.productId).toBe(1);
      });
  });

  it('/wishlist (GET)', () => {
    return request(app.getHttpServer())
      .get('/wishlist')
      .set('Authorization', 'Bearer test_token') // Adjust for auth
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });

  it('/wishlist/:productId (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/wishlist/1')
      .set('Authorization', 'Bearer test_token') // Adjust for auth
      .expect(200);
  });
});