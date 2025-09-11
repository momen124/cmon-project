import request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Wishlist } from '../src/entities/wishlist.entity';
import { Repository } from 'typeorm';
import { User } from '../src/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Product } from '../src/entities/product.entity';
import { Category } from '../src/entities/category.entity';
import { app, userRepository } from './setup-e2e';

describe('WishlistController (e2e)', () => {
  let wishlistRepository: Repository<Wishlist>;
  let productRepository: Repository<Product>;
  let categoryRepository: Repository<Category>;
  let userToken: string;
  let user: User;
  let product: Product;

  beforeAll(async () => {
    wishlistRepository = app.get<Repository<Wishlist>>(getRepositoryToken(Wishlist));
    productRepository = app.get<Repository<Product>>(getRepositoryToken(Product));
    categoryRepository = app.get<Repository<Category>>(getRepositoryToken(Category));
  });

  beforeEach(async () => {
    // Clean up all data before each test
    await wishlistRepository.delete({});
    await productRepository.delete({});
    await categoryRepository.delete({});

    // Create user
    const hashedPassword = await bcrypt.hash('password', 10);
    user = userRepository.create({ email: 'user@example.com', password: hashedPassword, name: 'User' });
    await userRepository.save(user);

    // Create category
    const category = categoryRepository.create({ name_en: 'Test Category', name_ar: 'فئة تجريبية' });
    await categoryRepository.save(category);

    // Create product
    product = productRepository.create({ 
      name_en: 'Test Product', 
      name_ar: 'منتج تجريبي', 
      price: 100, 
      stock: 10, 
      category_id: category.id 
    });
    await productRepository.save(product);

    // Authenticate as user to get a token
    const userResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'user@example.com', password: 'password' });
    userToken = userResponse.body.access_token;
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