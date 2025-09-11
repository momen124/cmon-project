import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';
import { Product } from './entities/product.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Category } from './entities/category.entity';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { Wishlist } from './entities/wishlist.entity';

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 5432),
  username: configService.get<string>('DB_USERNAME', 'postgres'),
  password: configService.get<string>('DB_PASSWORD', 'your_password'),
  database: configService.get<string>('DB_DATABASE', 'cmon-project'),
  entities: [
  User, 
  Product, 
  Order, 
  OrderItem, 
  Category, 
  PasswordResetToken, 
  Wishlist
],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  synchronize: false,
});