import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ValidationPipe } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  create(@Body(new ValidationPipe()) createAddressDto: CreateAddressDto, @Request() req) {
    return this.addressesService.create(createAddressDto, req.user.userId);
  }

  @Get()
  findAll(@Request() req) {
    return this.addressesService.findAllForUser(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.addressesService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body(new ValidationPipe()) updateAddressDto: UpdateAddressDto, @Request() req) {
    return this.addressesService.update(id, updateAddressDto, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.addressesService.remove(id, req.user.userId);
  }

  @Patch(':id/default')
  setDefault(@Param('id') id: string, @Request() req) {
    return this.addressesService.setDefault(id, req.user.userId);
  }
}
