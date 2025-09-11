import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../src/entities/product.entity';
import { Repository } from 'typeorm';
import { User } from '../src/entities/user.entity';
import * as bcrypt from 'bcrypt';

describe('ProductsController (e2e)', () => {
  let app: INestApplication;
  let repository: Repository<Product>;
  let userRepository: Repository<User>;
  let adminToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    repository = moduleFixture.get<Repository<Product>>(getRepositoryToken(Product));
    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));

    // Create admin user
    const hashedPassword = await bcrypt.hash('adminpassword', 10);
    const admin = userRepository.create({ email: 'admin@example.com', password: hashedPassword, role: 'admin', name: 'Admin' });
    await userRepository.save(admin);


    // Authenticate as admin to get a token
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@example.com', password: 'adminpassword' });

    adminToken = response.body.access_token;
  });

  afterEach(async () => {
    await app.close();
  });

  it('/products (GET)', async () => {
    const product = new Product();
    product.name_en = 'Test Product';
    product.name_ar = 'منتج تجريبي';
    product.price = 100;
    product.stock = 10;
    product.category_id = 'cat-id';
    await repository.save(product);

    return request(app.getHttpServer())
      .get('/products')
      .expect(200)
      .expect(res => {
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBe(1);
        expect(res.body[0].name).toBe('Test Product');
      });
  });

  it('/products/:id (GET)', async () => {
    const product = new Product();
    product.name_en = 'Test Product';
    product.name_ar = 'منتج تجريبي';
    product.price = 100;
    product.stock = 10;
    product.category_id = 'cat-id';
    const savedProduct = await repository.save(product);

    return request(app.getHttpServer())
      .get(`/products/${savedProduct.id}`)
      .expect(200)
      .expect(res => {
        expect(res.body.name).toBe('Test Product');
      });
  });

  it('/products (POST)', async () => {
    const createProductDto = {
      name_en: 'New Product',
      name_ar: 'منتج جديد',
      price: 200,
      stock: 20,
      category_id: 'cat-id',
    };

    return request(app.getHttpServer())
      .post('/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(createProductDto)
      .expect(201)
      .expect(res => {
        expect(res.body.name_en).toBe('New Product');
      });
  });

  it('/products/:id (PATCH)', async () => {
    const product = new Product();
    product.name_en = 'Test Product';
    product.name_ar = 'منتج تجريبي';
    product.price = 100;
    product.stock = 10;
    product.category_id = 'cat-id';
    const savedProduct = await repository.save(product);
    const updateProductDto = { name_en: 'Updated Product' };

    return request(app.getHttpServer())
      .patch(`/products/${savedProduct.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(updateProductDto)
      .expect(200)
      .expect(res => {
        expect(res.body.name_en).toBe('Updated Product');
      });
  });

  it('/products/:id (DELETE)', async () => {
    const product = new Product();
    product.name_en = 'Test Product';
    product.name_ar = 'منتج تجريبي';
    product.price = 100;
    product.stock = 10;
    product.category_id = 'cat-id';
    const savedProduct = await repository.save(product);

    return request(app.getHttpServer())
      .delete(`/products/${savedProduct.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(204);
  });
});
