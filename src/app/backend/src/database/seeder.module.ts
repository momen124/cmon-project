import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Wishlist } from '../entities/wishlist.entity';
import { Cart } from '../entities/cart.entity';
import { SeederService } from './seeder';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Product,
      Category,
      Order,
      OrderItem,
      Wishlist,
      Cart,
    ]),
  ],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}