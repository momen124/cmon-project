import { Injectable, NotFoundException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOne(email: string): Promise<User | null> {
    try {
      return await this.userRepository.findOne({ where: { email } as FindOptionsWhere<User> });
    } catch (error) {
      console.error('Find user error:', error);
      if (error.code === '42P01') {
        throw new InternalServerErrorException('Database table "users" does not exist');
      }
      throw error;
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findOne({ where: { id } as FindOptionsWhere<User> });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      console.error('Find user by ID error:', error);
      if (error.code === '42P01') {
        throw new InternalServerErrorException('Database table "users" does not exist');
      }
      throw error;
    }
  }

  async create(createUserDto: CreateUserDto & { role?: string }): Promise<User> {
    try {
      const user = this.userRepository.create(createUserDto);
      return await this.userRepository.save(user);
    } catch (error) {
      console.error('Create user error:', error);
      if (error.code === '42P01') {
        throw new InternalServerErrorException('Database table "users" does not exist');
      }
      throw error;
    }
  }

  async update(id: string, updateUserDto: Partial<CreateUserDto>): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { id } as FindOptionsWhere<User> });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      await this.userRepository.update({ id } as FindOptionsWhere<User>, updateUserDto);
      const updatedUser = await this.userRepository.findOne({ where: { id } as FindOptionsWhere<User> });
      if (!updatedUser) {
        throw new NotFoundException('User not found after update');
      }
      return updatedUser;
    } catch (error) {
      console.error('Update user error:', error);
      if (error.code === '42P01') {
        throw new InternalServerErrorException('Database table "users" does not exist');
      }
      throw error;
    }
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } as FindOptionsWhere<User> });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordMatching = await bcrypt.compare(changePasswordDto.currentPassword, user.password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Wrong current password');
    }

    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
    await this.userRepository.update({ id: userId } as FindOptionsWhere<User>, { password: hashedPassword });
  }
}