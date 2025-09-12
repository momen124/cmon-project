import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

// Load environment variables based on NODE_ENV
if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' });
} else {
  config();
}

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 5432),
  username: configService.get<string>('DB_USERNAME', 'postgres'),
  password: configService.get<string>('DB_PASSWORD', 'your_password'),
  database: configService.get<string>('DB_DATABASE', 'cmon-project'),
  entities: [
    process.env.NODE_ENV === 'production' 
      ? 'dist/**/*.entity{.ts,.js}'
      : 'src/**/*.entity{.ts,.js}'
  ],
  migrations: [
    process.env.NODE_ENV === 'production' 
      ? 'dist/migrations/*{.ts,.js}'
      : 'src/migrations/*{.ts,.js}'
  ],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
});