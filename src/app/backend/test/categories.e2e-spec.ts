import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import  request from 'supertest';
import { setupTestApp } from './setup-e2e'; // Adjust path
import { CategoriesModule } from '../src/categories/categories.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Category } from 'src/entities/category.entity';

describe('CategoriesController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let categoryRepository: any;

  beforeAll(async () => {
    const { app: testApp, dataSource: ds } = await setupTestApp();
    app = testApp;
    dataSource = ds;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CategoriesModule],
    }).compile();

    categoryRepository = moduleFixture.get(getRepositoryToken(Category));
  });

  beforeEach(async () => {
    try {
      await categoryRepository.clear();
      await categoryRepository.save({
        name: 'Test Category',
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

  it('/categories (GET)', () => {
    return request(app.getHttpServer())
      .get('/categories')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });

  it('/categories/:id (GET)', () => {
    return request(app.getHttpServer())
      .get('/categories/1')
      .expect(200)
      .expect((res) => {
        expect(res.body.name).toBe('Test Category');
      });
  });

  it('/categories (POST)', () => {
    return request(app.getHttpServer())
      .post('/categories')
      .send({ name: 'New Category' })
      .expect(201)
      .expect((res) => {
        expect(res.body.name).toBe('New Category');
      });
  });

  it('/categories/:id (PATCH)', () => {
    return request(app.getHttpServer())
      .patch('/categories/1')
      .send({ name: 'Updated Category' })
      .expect(200)
      .expect((res) => {
        expect(res.body.name).toBe('Updated Category');
      });
  });

  it('/categories/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/categories/1')
      .expect(200);
  });
});