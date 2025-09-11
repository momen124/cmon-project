import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request, ValidationPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { User } from '../entities/user.entity';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Request() req: { user: User }, @Body(new ValidationPipe()) createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto, req.user);
  }

  @Get()
  findAllForUser(@Request() req: { user: { userId: string } }) {
    return this.ordersService.findAllForUser(req.user.userId);
  }

  @Get('admin')
  @UseGuards(RolesGuard)
  @Roles('admin', 'superadmin')
  findAllForAdmin() {
    return this.ordersService.findAllForAdmin();
  }

  @Get(':id')
  findOneForUser(@Param('id') id: string, @Request() req: { user: { userId: string } }) {
    return this.ordersService.findOneForUser(id, req.user.userId);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles('admin', 'superadmin')
  updateStatus(@Param('id') id: string, @Body(new ValidationPipe()) updateOrderStatusDto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, updateOrderStatusDto);
  }
}
