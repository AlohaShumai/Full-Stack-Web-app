import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderFromCartDto } from './dto/create-order-from-cart.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Orders')
@ApiBearerAuth('access-token')
@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // POST /orders/checkout -> create order from current cart
  @Post('checkout')
  createFromCart(@Req() req: any, @Body() dto: CreateOrderFromCartDto) {
    return this.ordersService.createOrderFromCart(req.user.sub, dto);
  }

  // GET /orders -> my orders
  @Get()
  getMyOrders(@Req() req: any) {
    return this.ordersService.getMyOrders(req.user.sub);
  }

  // GET /orders/:id -> my order OR admin can see any
  @Get(':id')
  getOrder(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.ordersService.getOrderById(
      id,
      req.user.sub,
      req.user.role as UserRole,
    );
  }

  // GET /orders/admin/all -> admin only
  @Get('admin/all')
  @Roles(UserRole.ADMIN)
  getAll(@Req() req: any) {
    return this.ordersService.getAllOrders(
      req.user.role as UserRole,
    );
  }

  // PATCH /orders/:id/status -> admin only
  @Patch(':id/status')
  @Roles(UserRole.ADMIN)
  updateStatus(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateOrderStatus(
      id,
      dto.status,
      req.user.role as UserRole,
    );
  }
}
