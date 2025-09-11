import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('ProductsService', () => {
  let service: ProductsService;
  let productRepository: Repository<Product>;

  const mockProductRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    preload: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of products in English', async () => {
      const product = { name_en: 'Test', name_ar: 'TestAr' } as Product;
      mockProductRepository.find.mockResolvedValue([product]);
      const result = await service.findAll('en');
      expect(result[0].name).toBe('Test');
    });

    it('should return an array of products in Arabic', async () => {
      const product = { name_en: 'Test', name_ar: 'TestAr' } as Product;
      mockProductRepository.find.mockResolvedValue([product]);
      const result = await service.findAll('ar');
      expect(result[0].name).toBe('TestAr');
    });
  });

  describe('findOne', () => {
    it('should return a single product and increment view count', async () => {
      const product = { id: 'some-id', view_count: 0 } as Product;
      mockProductRepository.findOne.mockResolvedValue(product);
      mockProductRepository.save.mockResolvedValue({ ...product, view_count: 1 });
      const result = await service.findOne('some-id');
      expect(result.view_count).toBe(1);
      expect(mockProductRepository.save).toHaveBeenCalledWith({ ...product, view_count: 1 });
    });

    it('should throw a NotFoundException if product is not found', async () => {
      mockProductRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne('some-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should successfully create a product', async () => {
      const createProductDto = { name_en: 'Test' };
      const product = new Product();
      mockProductRepository.create.mockReturnValue(product);
      mockProductRepository.save.mockResolvedValue(product);
      expect(await service.create(createProductDto as any)).toEqual(product);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updateProductDto = { name_en: 'Updated Test' };
      const product = new Product();
      mockProductRepository.preload.mockResolvedValue(product);
      mockProductRepository.save.mockResolvedValue(product);
      expect(await service.update('some-id', updateProductDto)).toEqual(product);
    });

    it('should throw a NotFoundException if product to update is not found', async () => {
      mockProductRepository.preload.mockResolvedValue(null);
      await expect(service.update('some-id', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      mockProductRepository.delete.mockResolvedValue({ affected: 1 });
      await service.remove('some-id');
      expect(mockProductRepository.delete).toHaveBeenCalledWith('some-id');
    });

    it('should throw a NotFoundException if product to remove is not found', async () => {
      mockProductRepository.delete.mockResolvedValue({ affected: 0 });
      await expect(service.remove('some-id')).rejects.toThrow(NotFoundException);
    });
  });
});
