import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { setupTestApp } from './setup-e2e';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../src/entities/user.entity';
import { Product } from '../src/entities/product.entity';
import { Cart } from '../src/entities/cart.entity';
import { AuthService } from '../src/auth/auth.service';

describe('CartController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let userRepository: Repository<User>;
  let productRepository: Repository<Product>;
  let cartRepository: Repository<Cart>;
  let authService: AuthService;
  let jwtToken: string;
  let testUser: User;
  let testProduct: Product;

  beforeAll(async () => {
    const { app: testApp, dataSource: ds } = await setupTestApp();
    app = testApp;
    dataSource = ds;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
    productRepository = moduleFixture.get<Repository<Product>>(getRepositoryToken(Product));
    cartRepository = moduleFixture.get<Repository<Cart>>(getRepositoryToken(Cart));
    authService = moduleFixture.get<AuthService>(AuthService);

    // Create a test user and product
    testUser = await userRepository.save({
      name: 'Test User',
      email: 'cart-test@example.com',
      password: 'password', // The service will hash it
    });

    testProduct = await productRepository.save({
      name_en: 'Test Product for Cart',
      name_ar: 'منتج اختبار للسلة',
      price: 100,
      stock: 10,
      category_id: 'some-category-id',
    });

    // Get a JWT token for the test user
    const loginResponse = await authService.login(testUser);
    jwtToken = loginResponse.access_token;
  });

  beforeEach(async () => {
    await cartRepository.clear();
  });

  afterAll(async () => {
    await app.close();
    await dataSource.dropDatabase();
  });

  it('/cart (POST) - should add an item to the cart', () => {
    return request(app.getHttpServer())
      .post('/cart')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ productId: testProduct.id, quantity: 2 })
      .expect(201)
      .expect((res) => {
        expect(res.body.productId).toBe(testProduct.id);
        expect(res.body.quantity).toBe(2);
      });
  });

  it('/cart (GET) - should get the user cart', async () => {
    await cartRepository.save({
      userId: testUser.id,
      productId: testProduct.id,
      quantity: 1,
    });

    return request(app.getHttpServer())
      .get('/cart')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(1);
        expect(res.body[0].productId).toBe(testProduct.id);
      });
  });

  it('/cart/:productId (PATCH) - should update an item quantity', async () => {
    await cartRepository.save({
      userId: testUser.id,
      productId: testProduct.id,
      quantity: 1,
    });

    return request(app.getHttpServer())
      .patch(`/cart/${testProduct.id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ quantity: 5 })
      .expect(200)
      .expect((res) => {
        expect(res.body.quantity).toBe(5);
      });
  });

  it('/cart/:productId (DELETE) - should remove an item from the cart', async () => {
    await cartRepository.save({
      userId: testUser.id,
      productId: testProduct.id,
      quantity: 1,
    });

    return request(app.getHttpServer())
      .delete(`/cart/${testProduct.id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);
  });
});
