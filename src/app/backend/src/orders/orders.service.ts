import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order, OrderStatus } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private dataSource: DataSource,
  ) {}

  async create(createOrderDto: CreateOrderDto, user: User): Promise<Order> {
    const { orderItems, shipping_info } = createOrderDto;
    
    let totalPrice = 0;
    const orderItemsToCreate: OrderItem[] = [];

    for (const item of orderItems) {
      const product = await this.productsRepository.findOne({ where: { id: item.productId } });
      if (!product) {
        throw new NotFoundException(`Product with ID "${item.productId}" not found`);
      }
      if (product.stock < item.quantity) {
        throw new BadRequestException(`Not enough stock for product "${product.name_en}"`);
      }
      
      totalPrice += product.price * item.quantity;
      
      const orderItem = new OrderItem();
      orderItem.product = product;
      orderItem.quantity = item.quantity;
      orderItem.price = product.price;
      orderItemsToCreate.push(orderItem);
    }
    
    const order = new Order();
    order.user = user;
    order.shipping_info = shipping_info;
    order.total_price = totalPrice;
    order.orderItems = orderItemsToCreate;

    // Use a transaction to ensure all or nothing
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        for (const item of orderItemsToCreate) {
            item.product.stock -= item.quantity;
            await queryRunner.manager.save(item.product);
        }
        const savedOrder = await queryRunner.manager.save(order);
        await queryRunner.commitTransaction();
        return savedOrder;
    } catch (err) {
        await queryRunner.rollbackTransaction();
        throw err;
    } finally {
        await queryRunner.release();
    }
  }

  findAllForUser(userId: string): Promise<Order[]> {
    return this.ordersRepository.find({ where: { user: { id: userId } }, relations: ['orderItems', 'orderItems.product'] });
  }

  async findOneForUser(id: string, userId: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({ where: { id, user: { id: userId } }, relations: ['orderItems', 'orderItems.product'] });
    if (!order) {
      throw new NotFoundException(`Order with ID "${id}" not found for user "${userId}"`);
    }
    return order;
  }

  findAllForAdmin(): Promise<Order[]> {
    return this.ordersRepository.find({ relations: ['orderItems', 'orderItems.product', 'user'] });
  }

  async updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto): Promise<Order> {
    const order = await this.ordersRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order with ID "${id}" not found`);
    }
    order.status = updateOrderStatusDto.status;
    return this.ordersRepository.save(order);
  }
}
