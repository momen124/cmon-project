import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { User } from '../entities/user.entity';
import { CartService } from '../cart/cart.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private readonly cartService: CartService,
  ) {}

  async create(userId: string, createOrderDto: CreateOrderDto): Promise<Order> {
    const order = this.orderRepository.create({
      ...createOrderDto,
      user: { id: userId } as User,
    });
    const savedOrder = await this.orderRepository.save(order);
    await this.cartService.clearCart(userId);
    return savedOrder;
  }

  async findAllForUser(userId: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['orderItems', 'orderItems.product', 'user'],
    });
  }

  async findAllForAdmin(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['orderItems', 'orderItems.product', 'user'],
    });
  }

  async findOneById(id: string, userId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['orderItems', 'orderItems.product', 'user'],
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id }, relations: ['user'] });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    await this.orderRepository.update({ id }, updateOrderStatusDto);
    return { ...order, ...updateOrderStatusDto };
  }
}