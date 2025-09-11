import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  const mockCategoriesService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call the service findAll method', async () => {
      await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call the service findOne method', async () => {
      await controller.findOne('some-id');
      expect(service.findOne).toHaveBeenCalledWith('some-id');
    });
  });

  describe('create', () => {
    it('should call the service create method', async () => {
      const createCategoryDto = { name_en: 'Test', name_ar: 'Test' };
      await controller.create(createCategoryDto);
      expect(service.create).toHaveBeenCalledWith(createCategoryDto);
    });
  });

  describe('update', () => {
    it('should call the service update method', async () => {
      const updateCategoryDto = { name_en: 'Updated Test' };
      await controller.update('some-id', updateCategoryDto);
      expect(service.update).toHaveBeenCalledWith('some-id', updateCategoryDto);
    });
  });

  describe('remove', () => {
    it('should call the service remove method', async () => {
      await controller.remove('some-id');
      expect(service.remove).toHaveBeenCalledWith('some-id');
    });
  });
});
