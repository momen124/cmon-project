import { Repository, DataSource } from 'typeorm';
import { Order } from '../entities/order.entity';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
export declare class OrdersService {
    private ordersRepository;
    private productsRepository;
    private dataSource;
    constructor(ordersRepository: Repository<Order>, productsRepository: Repository<Product>, dataSource: DataSource);
    create(createOrderDto: CreateOrderDto, user: User): Promise<Order>;
    findAllForUser(userId: string): Promise<Order[]>;
    findOneForUser(id: string, userId: string): Promise<Order>;
    findAllForAdmin(): Promise<Order[]>;
    updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto): Promise<Order>;
}
