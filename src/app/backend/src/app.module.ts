import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './app.controller';
import { AppService } from './app.service';
import { User } from './entities/user.entity';
import { Product } from './entities/product.entity';
import { SeedService } from './seed/seed.service';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { EmailModule } from './email/email.module';
import { OrdersModule } from './orders/orders.module';

import { WishlistModule } from './wishlist/wishlist.module';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Category } from './entities/category,entity';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { Wishlist } from './entities/whislist.entity';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60 seconds
        limit: 100, // 100 requests per minute
      },
    ]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [User, Product, Order, OrderItem, Category, PasswordResetToken, Wishlist],
        synchronize: false,
        logging: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    ProductsModule,
    EmailModule,
    OrdersModule,
    CategoriesModule,
    WishlistModule,
  ],
  controllers: [AuthController],
  providers: [
    AppService,
    SeedService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}