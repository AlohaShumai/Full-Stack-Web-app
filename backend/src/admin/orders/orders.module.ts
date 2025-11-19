import { Module } from '@nestjs/common';
import { OrdersAdminService } from './orders.service';
import { OrdersAdminController } from './orders.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [OrdersAdminController],
  providers: [OrdersAdminService, PrismaService],
})
export class OrdersAdminModule {}
