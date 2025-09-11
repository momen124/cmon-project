import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';
import { Wishlist } from 'src/entities/whislist.entity';
import { AddToWishlistDto } from './dto/w';
export declare class WishlistService {
    private wishlistRepository;
    private productsRepository;
    constructor(wishlistRepository: Repository<Wishlist>, productsRepository: Repository<Product>);
    getWishlist(user: User): Promise<Product[]>;
    addToWishlist(addToWishlistDto: AddToWishlistDto, user: User): Promise<Wishlist>;
    removeFromWishlist(productId: string, user: User): Promise<void>;
}
