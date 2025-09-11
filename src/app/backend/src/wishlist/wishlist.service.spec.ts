import { Test, TestingModule } from '@nestjs/testing';
import { WishlistService } from './wishlist.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Wishlist } from '../entities/wishlist.entity';
import { Product } from '../entities/product.entity';
import { Repository } from 'typeorm';

describe('WishlistService', () => {
  let service: WishlistService;
  let wishlistRepository: Repository<Wishlist>;
  let productRepository: Repository<Product>;

  const mockWishlistRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
  };

  const mockProductRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WishlistService,
        {
          provide: getRepositoryToken(Wishlist),
          useValue: mockWishlistRepository,
        },
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<WishlistService>(WishlistService);
    wishlistRepository = module.get<Repository<Wishlist>>(
      getRepositoryToken(Wishlist),
    );
    productRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
