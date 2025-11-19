import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const totalProducts = await this.prisma.product.count();
    const totalOrders = await this.prisma.order.count();
    const totalUsers = await this.prisma.user.count();

    // Sum of all order totals
    const revenue = await this.prisma.order.aggregate({
      _sum: {
        total: true,
      },
    });

    return {
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue: revenue._sum.total ?? 0,
    };
  }
}
