import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from '../src/entities/category.entity';
import { Repository } from 'typeorm';
import { User } from '../src/entities/user.entity';
import * as bcrypt from 'bcrypt';

describe('CategoriesController (e2e)', () => {
  let app: INestApplication;
  let repository: Repository<Category>;
  let userRepository: Repository<User>;
  let adminToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    repository = moduleFixture.get<Repository<Category>>(getRepositoryToken(Category));
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

  it('/categories (GET)', async () => {
    const category = new Category();
    category.name_en = 'Test Category';
    category.name_ar = 'تصنيف تجريبي';
    await repository.save(category);

    return request(app.getHttpServer())
      .get('/categories')
      .expect(200)
      .expect(res => {
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBe(1);
        expect(res.body[0].name_en).toBe('Test Category');
      });
  });

  it('/categories/:id (GET)', async () => {
    const category = new Category();
    category.name_en = 'Test Category';
    category.name_ar = 'تصنيف تجريبي';
    const savedCategory = await repository.save(category);

    return request(app.getHttpServer())
      .get(`/categories/${savedCategory.id}`)
      .expect(200)
      .expect(res => {
        expect(res.body.name_en).toBe('Test Category');
      });
  });

  it('/categories (POST)', async () => {
    const createCategoryDto = { name_en: 'New Category', name_ar: 'تصنيف جديد' };

    return request(app.getHttpServer())
      .post('/categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(createCategoryDto)
      .expect(201)
      .expect(res => {
        expect(res.body.name_en).toBe('New Category');
      });
  });

  it('/categories/:id (PATCH)', async () => {
    const category = new Category();
    category.name_en = 'Test Category';
    category.name_ar = 'تصنيف تجريبي';
    const savedCategory = await repository.save(category);
    const updateCategoryDto = { name_en: 'Updated Category' };

    return request(app.getHttpServer())
      .patch(`/categories/${savedCategory.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(updateCategoryDto)
      .expect(200)
      .expect(res => {
        expect(res.body.name_en).toBe('Updated Category');
      });
  });

  it('/categories/:id (DELETE)', async () => {
    const category = new Category();
    category.name_en = 'Test Category';
    category.name_ar = 'تصنيف تجريبي';
    const savedCategory = await repository.save(category);

    return request(app.getHttpServer())
      .delete(`/categories/${savedCategory.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(204);
  });
});
