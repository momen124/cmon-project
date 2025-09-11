import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-categroy.dto';
import { Category } from 'src/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService, TypeOrmModule],
})
export class CategoriesModule {}
