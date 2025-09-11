import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a user', async () => {
      const createUserDto = { email: 'test@test.com', password: 'password', name: 'Test' };
      const user = new User();
      mockUserRepository.create.mockReturnValue(user);
      mockUserRepository.save.mockResolvedValue(user);

      const result = await service.create(createUserDto);
      expect(mockUserRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(mockUserRepository.save).toHaveBeenCalledWith(user);
      expect(result).toEqual(user);
    });
  });

  describe('findOne', () => {
    it('should find and return a user by email', async () => {
      const user = new User();
      mockUserRepository.findOne.mockResolvedValue(user);
      const result = await service.findOne('test@test.com');
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { email: 'test@test.com' } });
      expect(result).toEqual(user);
    });

    it('should return undefined if user not found by email', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      const result = await service.findOne('test@test.com');
      expect(result).toBeUndefined();
    });
  });

  describe('findById', () => {
    it('should find and return a user by id', async () => {
      const user = new User();
      mockUserRepository.findOne.mockResolvedValue(user);
      const result = await service.findById('some-id');
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: 'some-id' } });
      expect(result).toEqual(user);
    });

    it('should return undefined if user not found by id', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      const result = await service.findById('some-id');
      expect(result).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should update and return a user', async () => {
      const updateUserDto = { name: 'Updated Test' };
      const user = new User();
      mockUserRepository.update.mockResolvedValue({} as any);
      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.update('some-id', updateUserDto);
      expect(mockUserRepository.update).toHaveBeenCalledWith('some-id', updateUserDto);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: 'some-id' } });
      expect(result).toEqual(user);
    });

    it('should throw an error if user to update is not found', async () => {
      mockUserRepository.update.mockResolvedValue({} as any);
      mockUserRepository.findOne.mockResolvedValue(null);
      await expect(service.update('some-id', {})).rejects.toThrow('User with id some-id not found');
    });
  });
});
