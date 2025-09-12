import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../src/entities/user.entity';
import { Product } from '../src/entities/product.entity';
import { Order } from '../src/entities/order.entity';
import { OrderItem } from '../src/entities/order-item.entity';
import { Category } from '../src/entities/category.entity';
import { PasswordResetToken } from '../src/entities/password-reset-token.entity';
import { Wishlist } from '../src/entities/wishlist.entity';
import { Cart } from '../src/entities/cart.entity';

const configService = new ConfigService();
export default new DataSource({
  type: 'postgres',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: 5433,  // Test port
  username: configService.get<string>('DB_USERNAME', 'postgres'),
  password: configService.get<string>('DB_PASSWORD', 'your_password'),
  database: 'cmon-project-test',  // Test DB
  entities: [User, Product, Order, OrderItem, Category, PasswordResetToken, Wishlist, Cart],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  synchronize: false,
});