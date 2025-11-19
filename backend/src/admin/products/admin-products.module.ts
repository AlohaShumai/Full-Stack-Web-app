import { Module } from '@nestjs/common';
import { AdminProductsService } from './admin-products.service';
import { AdminProductsController } from './admin-products.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [AdminProductsController],
  providers: [AdminProductsService, PrismaService],
})
export class AdminProductsModule {}
