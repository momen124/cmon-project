import { Controller, Get, Post, Patch, Param, Body, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { IsUUID } from 'class-validator';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

class OrderIdDto {
  @IsUUID('4', { message: 'Order ID must be a valid UUID' })
  id: string;
}

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    if (!req.user.userId) {
      throw new BadRequestException('User ID is missing');
    }
    return this.ordersService.create(req.user.userId, createOrderDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req) {
    if (!req.user.userId) {
      throw new BadRequestException('User ID is missing');
    }
    return this.ordersService.findAllForUser(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin')
  async findAllAdmin() {
    return this.ordersService.findAllForAdmin();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Request() req, @Param('id', ValidationPipe) orderId: OrderIdDto) {
    if (!req.user.userId) {
      throw new BadRequestException('User ID is missing');
    }
    return this.ordersService.findOneById(orderId.id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  async updateStatus(@Param('id', ValidationPipe) orderId: OrderIdDto, @Body() updateOrderStatusDto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(orderId.id, updateOrderStatusDto);
  }
}