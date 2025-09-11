import { Product } from './product.entity';
import { Order } from './order.entity';
export declare class OrderItem {
    id: string;
    order: Order;
    product: Product;
    quantity: number;
    price: number;
}
