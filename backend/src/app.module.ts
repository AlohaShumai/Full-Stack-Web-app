// src/app.module.ts
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { CatalogModule } from './catalog/catalog.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';

import { RolesGuard } from './auth/roles.guard';
import { DashboardModule } from './admin/dashboard.module';
import { AdminProductsModule } from './admin/products/admin-products.module';
import { OrdersAdminModule } from './admin/orders/orders.module';


@Module({
  imports: [
    // 👇 makes ConfigService available app-wide
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    AuthModule,
    DashboardModule,
    AdminProductsModule,
    OrdersAdminModule,
    CatalogModule,
    CartModule,
    OrdersModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
