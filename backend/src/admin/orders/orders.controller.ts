import { Controller, Get, Param, Patch, Body } from '@nestjs/common';
import { OrdersAdminService } from './orders.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Controller('admin/orders')
export class OrdersAdminController {
  constructor(private readonly service: OrdersAdminService) {}

  @Get()
  getAll() {
    return this.service.getAllOrders();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.service.getOrderById(Number(id));
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.service.updateOrderStatus(Number(id), dto);
  }
}
