import { User } from './user.entity';
import { Product } from './product.entity';
export declare class Wishlist {
    userId: string;
    productId: string;
    user: User;
    product: Product;
}
