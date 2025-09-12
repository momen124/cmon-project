import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from '../src/app.module';
import { AllExceptionsFilter } from '../src/common/filters/http-exception.filter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';

// Define a test module class for DynamicModule
@Module({})
class TestModule {}

// Create dynamic test module
export function createTestModule(): any {
  return {
    module: TestModule,
    imports: [
      AppModule,
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: 'localhost',
        port: 5433,
        username: 'postgres',
        password: 'your_password', // Replace with actual password or use process.env.DB_TEST_PASSWORD
        database: 'cmon-project-test',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'], // Broader path to catch all entities
        synchronize: false, // Disable auto-sync to control manually
        dropSchema: true, // Drop schema before manual sync
        logging: true, // Enable for debugging SQL (disable in CI)
      }),
    ],
  };
}

export async function setupTestApp() {
  const testModule = createTestModule();
  const app = await NestFactory.create(testModule, { snapshot: true });

  // Get TypeORM DataSource
  const dataSource = app.get(DataSource);

  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors({ origin: true });

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Test API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, config));

  await app.init();

  // Manually drop and sync database to ensure tables are created
  try {
    await dataSource.synchronize(true); // true = dropBeforeSync
    console.log('Database synchronized successfully for tests.');
  } catch (error) {
    console.error('Synchronization error:', error);
    throw error; // Fail fast if sync fails
  }

  return { app, dataSource }; // Return dataSource for test cleanup
}