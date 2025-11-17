// src/catalog/catalog.module.ts
import { Module } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CatalogController } from './catalog.controller';
import { PrismaService } from '../prisma/prisma.service';
import { RolesGuard } from '../common/guards/roles.guard';

@Module({
  controllers: [CatalogController],
  providers: [CatalogService, PrismaService, RolesGuard],
})
export class CatalogModule {}
