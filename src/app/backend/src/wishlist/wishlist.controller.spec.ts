import { Test, TestingModule } from '@nestjs/testing';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';

describe('WishlistController', () => {
  let controller: WishlistController;

  const mockWishlistService = {
    addToWishlist: jest.fn(),
    getWishlist: jest.fn(),
    removeFromWishlist: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WishlistController],
      providers: [
        {
          provide: WishlistService,
          useValue: mockWishlistService,
        },
      ],
    }).compile();

    controller = module.get<WishlistController>(WishlistController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
