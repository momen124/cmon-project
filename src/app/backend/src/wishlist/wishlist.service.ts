import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from '../entities/wishlist.entity';
import { Product } from '../entities/product.entity';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async findAll(userId: string): Promise<Wishlist[]> {
    return this.wishlistRepository.find({
      where: { userId },
      relations: ['product'],
    });
  }

  async add(userId: string, productId: string): Promise<Wishlist> {
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
    const wishlistItem = this.wishlistRepository.create({ userId, productId });
    return this.wishlistRepository.save(wishlistItem);
  }

  async remove(userId: string, productId: string): Promise<void> {
    const result = await this.wishlistRepository.delete({ userId, productId });
    if (result.affected === 0) {
      throw new NotFoundException(`Wishlist item not found`);
    }
  }
}