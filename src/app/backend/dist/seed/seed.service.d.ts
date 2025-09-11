import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Product } from '../entities/product.entity';
export declare class SeedService {
    private userRepository;
    private productRepository;
    constructor(userRepository: Repository<User>, productRepository: Repository<Product>);
    seed(): Promise<void>;
}
