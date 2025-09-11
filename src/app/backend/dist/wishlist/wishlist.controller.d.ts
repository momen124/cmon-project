import { WishlistService } from './wishlist.service';
import { User } from '../entities/user.entity';
import { AddToWishlistDto } from './dto/w';
export declare class WishlistController {
    private readonly wishlistService;
    constructor(wishlistService: WishlistService);
    getWishlist(req: {
        user: User;
    }): Promise<import("../entities/product.entity").Product[]>;
    addToWishlist(req: {
        user: User;
    }, addToWishlistDto: AddToWishlistDto): Promise<import("../entities/wishlist.entity").Wishlist>;
    removeFromWishlist(productId: string, req: {
        user: User;
    }): Promise<void>;
}
