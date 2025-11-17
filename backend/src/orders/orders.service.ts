import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderFromCartDto } from './dto/create-order-from-cart.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus, UserRole } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  // Create an order from the current user's cart
  async createOrderFromCart(userId: number, dto: CreateOrderFromCartDto) {
    const cartItems = await this.prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    if (!cartItems.length) {
      throw new BadRequestException('Cart is empty');
    }

    return this.prisma.$transaction(async (tx) => {
      // Check stock
      for (const item of cartItems) {
        if (item.product.stock < item.quantity) {
          throw new BadRequestException(
            `Not enough stock for ${item.product.name}`,
          );
        }
      }

      // Compute total
      const total = cartItems.reduce((sum, item) => {
        const priceNum = Number(item.product.price);
        return sum + priceNum * item.quantity;
      }, 0);

      // Create order
      const order = await tx.order.create({
        data: {
          userId,
          total,
          status: OrderStatus.PENDING,
          // If you later add shippingAddress/notes columns to Order,
          // you can put them here from dto.
        },
      });

      // Create order items
      await tx.orderItem.createMany({
        data: cartItems.map((item) => ({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.product.price,
        })),
      });

      // Decrement stock
      for (const item of cartItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: item.product.stock - item.quantity,
          },
        });
      }

      // Clear cart
      await tx.cartItem.deleteMany({
        where: { userId },
      });

      // Return order with items
      return tx.order.findUnique({
        where: { id: order.id },
        include: {
          items: {
            include: { product: true },
          },
        },
      });
    });
  }

  // List orders for current user
  async getMyOrders(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: { product: true },
        },
      },
    });
  }

  // Get single order (user can see only their own, unless admin)
  async getOrderById(
    id: number,
    userId: number,
    role: UserRole,
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: { product: true },
        },
        user: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== userId && role !== UserRole.ADMIN) {
      throw new ForbiddenException('You cannot view this order');
    }

    return order;
  }

  // Admin: list all orders
  async getAllOrders(role: UserRole) {
    if (role !== UserRole.ADMIN) {
      throw new ForbiddenException('Admins only');
    }

    return this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: { product: true },
        },
        user: true,
      },
    });
  }

  // Admin: update order status
  async updateOrderStatus(
    id: number,
    status: OrderStatus,
    role: UserRole,
  ) {
    if (role !== UserRole.ADMIN) {
      throw new ForbiddenException('Admins only');
    }

    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.prisma.order.update({
      where: { id },
      data: { status },
    });
  }
}
