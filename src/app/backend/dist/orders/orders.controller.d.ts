import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { User } from '../entities/user.entity';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(req: {
        user: User;
    }, createOrderDto: CreateOrderDto): Promise<import("../entities/order.entity").Order>;
    findAllForUser(req: {
        user: {
            userId: string;
        };
    }): Promise<import("../entities/order.entity").Order[]>;
    findAllForAdmin(): Promise<import("../entities/order.entity").Order[]>;
    findOneForUser(id: string, req: {
        user: {
            userId: string;
        };
    }): Promise<import("../entities/order.entity").Order>;
    updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto): Promise<import("../entities/order.entity").Order>;
}
