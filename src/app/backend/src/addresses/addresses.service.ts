import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from '../entities/address.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address)
    private addressesRepository: Repository<Address>,
  ) {}

  findAllForUser(userId: string): Promise<Address[]> {
    return this.addressesRepository.find({ where: { user: { id: userId } } });
  }

  async findOne(id: string, userId: string): Promise<Address> {
    const address = await this.addressesRepository.findOne({ where: { id, user: { id: userId } } });
    if (!address) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }
    return address;
  }

  async create(createAddressDto: CreateAddressDto, userId: string): Promise<Address> {
    if (createAddressDto.isDefault) {
      await this.clearCurrentDefault(userId);
    }
    const address = this.addressesRepository.create({ ...createAddressDto, user: { id: userId } as User });
    return this.addressesRepository.save(address);
  }

  async update(id: string, updateAddressDto: UpdateAddressDto, userId: string): Promise<Address> {
    if (updateAddressDto.isDefault) {
      await this.clearCurrentDefault(userId);
    }
    const address = await this.findOne(id, userId);
    const updatedAddress = { ...address, ...updateAddressDto };
    return this.addressesRepository.save(updatedAddress);
  }

  async remove(id: string, userId: string): Promise<void> {
    const result = await this.addressesRepository.delete({ id, user: { id: userId } });
    if (result.affected === 0) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }
  }

  async setDefault(id: string, userId: string): Promise<Address> {
    await this.clearCurrentDefault(userId);
    const address = await this.findOne(id, userId);
    address.isDefault = true;
    return this.addressesRepository.save(address);
  }

  private async clearCurrentDefault(userId: string): Promise<void> {
    await this.addressesRepository.update({ user: { id: userId }, isDefault: true }, { isDefault: false });
  }
}
