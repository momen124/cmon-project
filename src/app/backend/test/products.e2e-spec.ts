import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import  request from 'supertest';
import { setupTestApp } from './setup-e2e'; // Adjust path
import { ProductsModule } from '../src/products/products.module';
import { getRepositoryToken } from '@nestjs/typeorm';

import { DataSource } from 'typeorm';
import { Product } from 'src/entities/product.entity';
import { User } from 'src/entities/user.entity';

describe('ProductsController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let productRepository: any; // TestingRepository<Product>
  let userRepository: any; // TestingRepository<User>

  beforeAll(async () => {
    const { app: testApp, dataSource: ds } = await setupTestApp();
    app = testApp;
    dataSource = ds;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ProductsModule],
    }).compile();

    productRepository = moduleFixture.get(getRepositoryToken(Product));
    userRepository = moduleFixture.get(getRepositoryToken(User));
  });

  beforeEach(async () => {
    try {
      await productRepository.clear();
      await userRepository.clear();
      // Seed test data if needed
      await userRepository.save({
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashed_password', // Adjust based on your entity
      });
      await productRepository.save({
        name: 'Test Product',
        price: 100,
        // Add user relation if needed, e.g., user: { id: 1 }
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

  it('/products (GET)', () => {
    return request(app.getHttpServer())
      .get('/products')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });

  it('/products/:id (GET)', () => {
    return request(app.getHttpServer())
      .get('/products/1')
      .expect(200)
      .expect((res) => {
        expect(res.body.name).toBe('Test Product');
      });
  });

  it('/products (POST)', () => {
    return request(app.getHttpServer())
      .post('/products')
      .send({ name: 'New Product', price: 200 })
      .expect(201)
      .expect((res) => {
        expect(res.body.name).toBe('New Product');
      });
  });

  it('/products/:id (PATCH)', () => {
    return request(app.getHttpServer())
      .patch('/products/1')
      .send({ name: 'Updated Product' })
      .expect(200)
      .expect((res) => {
        expect(res.body.name).toBe('Updated Product');
      });
  });

  it('/products/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/products/1')
      .expect(200);
  });
});