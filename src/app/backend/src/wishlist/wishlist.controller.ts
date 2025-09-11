import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request, ValidationPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../entities/user.entity';
import { AddToWishlistDto } from './dto/w';

@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  getWishlist(@Request() req: { user: User }) {
    return this.wishlistService.getWishlist(req.user);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  addToWishlist(@Request() req: { user: User }, @Body(new ValidationPipe()) addToWishlistDto: AddToWishlistDto) {
    return this.wishlistService.addToWishlist(addToWishlistDto, req.user);
  }

  @Delete(':productId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeFromWishlist(@Param('productId') productId: string, @Request() req: { user: User }) {
    return this.wishlistService.removeFromWishlist(productId, req.user);
  }
}
