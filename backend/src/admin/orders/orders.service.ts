import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersAdminService {
  constructor(private prisma: PrismaService) {}

  async getAllOrders() {
    return this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, email: true, name: true },
        },
        items: true,
      },
    });
  }

  async getOrderById(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, email: true, name: true } },
        items: {
          include: {
            product: { select: { id: true, name: true, price: true } },
          },
        },
      },
    });

    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateOrderStatus(id: number, dto: UpdateOrderStatusDto) {
    return this.prisma.order.update({
      where: { id },
      data: { status: dto.status },
    });
  }
}
