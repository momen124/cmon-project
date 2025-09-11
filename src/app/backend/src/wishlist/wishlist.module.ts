import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';
import { ProductsModule } from '../products/products.module';
import { Wishlist } from 'src/entities/whislist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wishlist]), ProductsModule],
  controllers: [WishlistController],
  providers: [WishlistService],
})
export class WishlistModule {}
