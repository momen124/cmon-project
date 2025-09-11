import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Wishlist } from '../src/entities/wishlist.entity';
import { Repository } from 'typeorm';
import { User } from '../src/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Product } from '../src/entities/product.entity';

describe('WishlistController (e2e)', () => {
  let app: INestApplication;
  let wishlistRepository: Repository<Wishlist>;
  let userRepository: Repository<User>;
  let productRepository: Repository<Product>;
  let userToken: string;
  let user: User;
  let product: Product;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    wishlistRepository = moduleFixture.get<Repository<Wishlist>>(getRepositoryToken(Wishlist));
    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
    productRepository = moduleFixture.get<Repository<Product>>(getRepositoryToken(Product));

    // Create user
    const hashedPassword = await bcrypt.hash('password', 10);
    user = userRepository.create({ email: 'user@example.com', password: hashedPassword, name: 'User' });
    await userRepository.save(user);

    // Create product
    product = productRepository.create({ name_en: 'Test Product', name_ar: 'منتج تجريبي', price: 100, stock: 10, category_id: 'cat-id' });
    await productRepository.save(product);

    // Authenticate as user to get a token
    const userResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'user@example.com', password: 'password' });
    userToken = userResponse.body.access_token;
  });

  afterEach(async () => {
    await app.close();
  });

  it('/wishlist (POST)', async () => {
    const addToWishlistDto = { productId: product.id };

    return request(app.getHttpServer())
      .post('/wishlist')
      .set('Authorization', `Bearer ${userToken}`)
      .send(addToWishlistDto)
      .expect(201);
  });

  it('/wishlist (GET)', async () => {
    return request(app.getHttpServer())
        .get('/wishlist')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);
  });

  it('/wishlist/:productId (DELETE)', async () => {
    const wishlistItem = wishlistRepository.create({ user, product });
    await wishlistRepository.save(wishlistItem);

    return request(app.getHttpServer())
        .delete(`/wishlist/${product.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);
  });
});
