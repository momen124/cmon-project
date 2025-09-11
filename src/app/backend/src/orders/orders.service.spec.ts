import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { Product } from '../entities/product.entity';
import { Repository, DataSource } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { User } from '../entities/user.entity';

describe('OrdersService', () => {
  let service: OrdersService;
  let orderRepository: Repository<Order>;
  let productRepository: Repository<Product>;
  let dataSource: DataSource;

  const mockOrderRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockProductRepository = {
    findOne: jest.fn(),
  };

  const mockQueryRunner = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: {
      save: jest.fn(),
    },
  };

  const mockDataSource = {
    createQueryRunner: jest.fn(() => mockQueryRunner),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrderRepository,
        },
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    orderRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
    productRepository = module.get<Repository<Product>>(getRepositoryToken(Product));
    dataSource = module.get<DataSource>(DataSource);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an order successfully', async () => {
      const user = { id: 'user-id' } as User;
      const createOrderDto = {
        orderItems: [{ productId: 'prod-id', quantity: 1 }],
        shipping_info: { address: '123 Test St' },
      };
      const product = { id: 'prod-id', name_en: 'Test Product', price: 10, stock: 5 } as Product;

      mockProductRepository.findOne.mockResolvedValue(product);
      mockQueryRunner.manager.save.mockResolvedValue(new Order());

      await service.create(createOrderDto as any, user);

      expect(mockDataSource.createQueryRunner).toHaveBeenCalled();
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.manager.save).toHaveBeenCalledTimes(2); // 1 for product stock, 1 for order
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });

    it('should throw BadRequestException for insufficient stock', async () => {
        const user = { id: 'user-id' } as User;
        const createOrderDto = {
          orderItems: [{ productId: 'prod-id', quantity: 10 }],
          shipping_info: { address: '123 Test St' },
        };
        const product = { id: 'prod-id', name_en: 'Test Product', price: 10, stock: 5 } as Product;
  
        mockProductRepository.findOne.mockResolvedValue(product);
  
        await expect(service.create(createOrderDto as any, user)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAllForUser', () => {
    it('should return an array of orders for a user', async () => {
      const userId = 'user-id';
      const order = new Order();
      mockOrderRepository.find.mockResolvedValue([order]);

      const result = await service.findAllForUser(userId);

      expect(mockOrderRepository.find).toHaveBeenCalledWith({ where: { user: { id: userId } }, relations: ['orderItems', 'orderItems.product'] });
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('findOneForUser', () => {
    it('should return a single order for a user', async () => {
      const userId = 'user-id';
      const orderId = 'order-id';
      const order = new Order();
      mockOrderRepository.findOne.mockResolvedValue(order);

      const result = await service.findOneForUser(orderId, userId);

      expect(mockOrderRepository.findOne).toHaveBeenCalledWith({ where: { id: orderId, user: { id: userId } }, relations: ['orderItems', 'orderItems.product'] });
      expect(result).toEqual(order);
    });
  });

  describe('findAllForAdmin', () => {
    it('should return an array of all orders for an admin', async () => {
      const order = new Order();
      mockOrderRepository.find.mockResolvedValue([order]);

      const result = await service.findAllForAdmin();

      expect(mockOrderRepository.find).toHaveBeenCalledWith({ relations: ['orderItems', 'orderItems.product', 'user'] });
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('updateStatus', () => {
    it('should update the status of an order', async () => {
      const orderId = 'order-id';
      const updateOrderStatusDto = { status: 'shipped' as any };
      const order = new Order();
      mockOrderRepository.findOne.mockResolvedValue(order);
      mockOrderRepository.save.mockResolvedValue({ ...order, ...updateOrderStatusDto });

      const result = await service.updateStatus(orderId, updateOrderStatusDto);

      expect(mockOrderRepository.findOne).toHaveBeenCalledWith({ where: { id: orderId } });
      expect(mockOrderRepository.save).toHaveBeenCalledWith({ ...order, ...updateOrderStatusDto });
      expect(result.status).toEqual('shipped');
    });

    it('should throw NotFoundException if order not found', async () => {
        mockOrderRepository.findOne.mockResolvedValue(null);
        await expect(service.updateStatus('some-id', { status: 'shipped' as any })).rejects.toThrow(NotFoundException);
    });
  });
});
