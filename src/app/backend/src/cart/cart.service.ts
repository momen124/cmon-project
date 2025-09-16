import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../entities/cart.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
  ) {}

  async getCart(userId: string): Promise<Cart[]> {
    return this.cartRepository.find({
      where: { userId },
      relations: ['product'],
    });
  }

  async addToCart(userId: string, addToCartDto: AddToCartDto): Promise<Cart> {
    const { productId, quantity, selectedSize, selectedColor } = addToCartDto;
    const cartItem = await this.cartRepository.findOne({
      where: { userId, productId },
    });

    if (cartItem) {
      cartItem.quantity += quantity;
      cartItem.selectedSize = selectedSize;
      cartItem.selectedColor = selectedColor;
      return this.cartRepository.save(cartItem);
    }

    const newCartItem = this.cartRepository.create({
      userId,
      productId,
      quantity,
      selectedSize,
      selectedColor,
    });
    return this.cartRepository.save(newCartItem);
  }

  async removeFromCart(userId: string, productId: string): Promise<void> {
    const result = await this.cartRepository.delete({ userId, productId });
    if (result.affected === 0) {
      throw new NotFoundException(`Cart item with product ID ${productId} not found`);
    }
  }

  async updateCartItem(userId: string, productId: string, updateCartItemDto: UpdateCartItemDto): Promise<Cart> {
    const { quantity } = updateCartItemDto;
    const cartItem = await this.cartRepository.findOne({
      where: { userId, productId },
    });

    if (!cartItem) {
      throw new NotFoundException(`Cart item with product ID ${productId} not found`);
    }

    cartItem.quantity = quantity;
    return this.cartRepository.save(cartItem);
  }

  async clearCart(userId: string): Promise<void> {
    await this.cartRepository.delete({ userId });
  }
}
