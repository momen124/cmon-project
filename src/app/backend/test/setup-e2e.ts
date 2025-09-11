import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/entities/user.entity';
import { Repository } from 'typeorm';

let app: INestApplication;
let userRepository: Repository<User>;

beforeAll(async () => {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
  await app.init();
});

beforeEach(async () => {
  // Clean up all users before each test
  await userRepository.delete({});
});

afterAll(async () => {
  await app.close();
});

export { app, userRepository };