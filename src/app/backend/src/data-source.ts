import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { Product } from './entities/product.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Category } from './entities/category.entity';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { Wishlist } from './entities/wishlist.entity';

// Determine if we're in test environment
const isTest = process.env.NODE_ENV === 'test';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'your_password',
  database: isTest ? 'cmon-project-test' : process.env.DB_DATABASE || 'cmon-project',
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
  synchronize: isTest, // Auto-create schema in test environment
  dropSchema: isTest, // Drop schema in test environment
});