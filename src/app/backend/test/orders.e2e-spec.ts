import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from '../src/entities/order.entity';
import { Repository } from 'typeorm';
import { User } from '../src/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Product } from '../src/entities/product.entity';

describe('OrdersController (e2e)', () => {
  let app: INestApplication;
  let orderRepository: Repository<Order>;
  let userRepository: Repository<User>;
  let productRepository: Repository<Product>;
  let adminToken: string;
  let userToken: string;
  let user: User;
  let product: Product;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    orderRepository = moduleFixture.get<Repository<Order>>(getRepositoryToken(Order));
    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
    productRepository = moduleFixture.get<Repository<Product>>(getRepositoryToken(Product));

    // Create admin user
    const hashedAdminPassword = await bcrypt.hash('adminpassword', 10);
    const admin = userRepository.create({ email: 'admin@example.com', password: hashedAdminPassword, role: 'admin', name: 'Admin' });
    await userRepository.save(admin);

    // Create regular user
    const hashedPassword = await bcrypt.hash('password', 10);
    user = userRepository.create({ email: 'user@example.com', password: hashedPassword, name: 'User' });
    await userRepository.save(user);

    // Create product
    product = productRepository.create({ name_en: 'Test Product', name_ar: 'منتج تجريبي', price: 100, stock: 10, category_id: 'cat-id' });
    await productRepository.save(product);


    // Authenticate as admin to get a token
    const adminResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@example.com', password: 'adminpassword' });
    adminToken = adminResponse.body.access_token;

    // Authenticate as user to get a token
    const userResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'user@example.com', password: 'password' });
    userToken = userResponse.body.access_token;
  });

  afterEach(async () => {
    await app.close();
  });

  it('/orders (POST)', async () => {
    const createOrderDto = {
      orderItems: [{ productId: product.id, quantity: 1 }],
      shipping_info: { address: '123 Test St' },
    };

    return request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${userToken}`)
      .send(createOrderDto)
      .expect(201);
  });

  it('/orders/user (GET)', async () => {
    return request(app.getHttpServer())
        .get('/orders/user')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);
  });

  it('/orders/admin (GET)', async () => {
    return request(app.getHttpServer())
        .get('/orders/admin')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
  });
});
