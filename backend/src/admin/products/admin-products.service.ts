import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class AdminProductsService {
  constructor(private prisma: PrismaService) {}

  async getAllProducts() {
    return this.prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async createProduct(dto: CreateProductDto) {
    const slug = dto.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    return this.prisma.product.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description,
        price: dto.price,
        stock: dto.stock,
        categoryId: dto.categoryId ?? null,
      },
    });
  }

  async updateProduct(id: number, dto: UpdateProductDto) {
    let slug: string | undefined = undefined;

    if (dto.name) {
      slug = dto.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        ...dto,
        slug,
      },
    });
  }

  async deleteProduct(id: number) {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
