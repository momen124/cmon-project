import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let repository: Repository<Category>;

  const mockCategoryRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    preload: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRepository,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    repository = module.get<Repository<Category>>(getRepositoryToken(Category));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      const category = new Category();
      mockCategoryRepository.find.mockResolvedValue([category]);
      expect(await service.findAll()).toEqual([category]);
    });
  });

  describe('findOne', () => {
    it('should return a single category', async () => {
      const category = new Category();
      mockCategoryRepository.findOne.mockResolvedValue(category);
      expect(await service.findOne('some-id')).toEqual(category);
    });

    it('should throw a NotFoundException if category is not found', async () => {
      mockCategoryRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne('some-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should successfully create a category', async () => {
      const createCategoryDto = { name_en: 'Test', name_ar: 'Test' };
      const category = new Category();
      mockCategoryRepository.create.mockReturnValue(category);
      mockCategoryRepository.save.mockResolvedValue(category);
      expect(await service.create(createCategoryDto)).toEqual(category);
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const updateCategoryDto = { name_en: 'Updated Test' };
      const category = new Category();
      mockCategoryRepository.preload.mockResolvedValue(category);
      mockCategoryRepository.save.mockResolvedValue(category);
      expect(await service.update('some-id', updateCategoryDto)).toEqual(category);
    });

    it('should throw a NotFoundException if category to update is not found', async () => {
      mockCategoryRepository.preload.mockResolvedValue(null);
      await expect(service.update('some-id', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a category', async () => {
      mockCategoryRepository.delete.mockResolvedValue({ affected: 1 });
      await service.remove('some-id');
      expect(mockCategoryRepository.delete).toHaveBeenCalledWith('some-id');
    });

    it('should throw a NotFoundException if category to remove is not found', async () => {
      mockCategoryRepository.delete.mockResolvedValue({ affected: 0 });
      await expect(service.remove('some-id')).rejects.toThrow(NotFoundException);
    });
  });
});
