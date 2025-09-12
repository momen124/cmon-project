import { Controller, Get, Post, Delete, Param, UseGuards, Request, BadRequestException, Body } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { IsUUID } from 'class-validator';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

class ProductIdDto {
  @IsUUID('4', { message: 'Product ID must be a valid UUID' })
  productId: string;
}

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req) {
    if (!req.user.userId) {
      throw new BadRequestException('User ID is missing');
    }
    return this.wishlistService.findAll(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async add(@Request() req, @Body() body: ProductIdDto) {
    if (!req.user.userId) {
      throw new BadRequestException('User ID is missing');
    }
    return this.wishlistService.add(req.user.userId, body.productId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':productId')
  async remove(@Request() req, @Param('productId', ValidationPipe) productIdDto: ProductIdDto) {
    if (!req.user.userId) {
      throw new BadRequestException('User ID is missing');
    }
    return this.wishlistService.remove(req.user.userId, productIdDto.productId);
  }
}