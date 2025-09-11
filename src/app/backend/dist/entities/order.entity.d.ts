import { User } from './user.entity';
import { OrderItem } from './order-item.entity';
export declare enum OrderStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    SHIPPED = "shipped",
    DELIVERED = "delivered",
    CANCELLED = "cancelled"
}
export declare class Order {
    id: string;
    user: User;
    orderItems: OrderItem[];
    total_price: number;
    status: OrderStatus;
    shipping_info: object;
    created_at: Date;
    updated_at: Date;
}
