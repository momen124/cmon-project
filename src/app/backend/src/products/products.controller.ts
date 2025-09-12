import { Controller, Get, Param, Post, Body, Patch, Delete, UseGuards, BadRequestException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { IsUUID } from 'class-validator';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

class ProductIdDto {
  @IsUUID('4', { message: 'ID must be a valid UUID' })
  id: string;
}

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ValidationPipe) productId: ProductIdDto) {
    const product = await this.productsService.findOne(productId.id);
    if (!product) {
      throw new BadRequestException('Product not found');
    }
    return product;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id', ValidationPipe) productId: ProductIdDto, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(productId.id, updateProductDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id', ValidationPipe) productId: ProductIdDto) {
    return this.productsService.remove(productId.id);
  }
}