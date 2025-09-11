import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';
import { Wishlist } from 'src/entities/wishlist.entity';
import { AddToWishlistDto } from './dto/w';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async getWishlist(user: User): Promise<Product[]> {
    const wishlistItems = await this.wishlistRepository.find({
      where: { userId: user.id },
      relations: ['product'],
    });
    return wishlistItems.map(item => item.product);
  }

  async addToWishlist(addToWishlistDto: AddToWishlistDto, user: User): Promise<Wishlist> {
    const { productId } = addToWishlistDto;
    const product = await this.productsRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException(`Product with ID "${productId}" not found`);
    }

    const wishlistItem = this.wishlistRepository.create({
      userId: user.id,
      productId: product.id,
    });

    return this.wishlistRepository.save(wishlistItem);
  }

  async removeFromWishlist(productId: string, user: User): Promise<void> {
    const result = await this.wishlistRepository.delete({
      userId: user.id,
      productId: productId,
    });

    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID "${productId}" not found in wishlist`);
    }
  }
}
