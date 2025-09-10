import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';
import { Product } from './entities/product.entity';

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 5432),
  username: configService.get<string>('DB_USERNAME', 'postgres'),
  password: configService.get<string>('DB_PASSWORD', 'your_password'),
  database: configService.get<string>('DB_DATABASE', 'cmon-project'),
  entities: [User, Product],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  synchronize: false,
});