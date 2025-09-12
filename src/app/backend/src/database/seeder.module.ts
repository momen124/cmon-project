import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { SeedCommand } from './seed.command';
import { SeedService } from 'src/seed/seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Product, Category])],
  providers: [SeedService, SeedCommand],
  exports: [SeedService],
})
export class SeedModule {}