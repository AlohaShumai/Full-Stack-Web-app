import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetProductsQueryDto } from './dto/get-products-query.dto';

@Injectable()
export class CatalogService {
  constructor(private prisma: PrismaService) {}

  // Simple helper to generate URL-friendly slugs
  private slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-') // replace non-alphanumeric with dashes
      .replace(/(^-|-$)+/g, '');   // remove leading/trailing dashes
  }

  // GET /catalog with filters, search, pagination, sorting
  async listProducts(query: GetProductsQueryDto) {
    const {
      search,
      categoryId,
      minPrice,
      maxPrice,
      page = 1,
      pageSize = 12,
      sort = 'newest',
    } = query;

    const where: Prisma.ProductWhereInput = {};

    // Text search on name/description
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Filter by category
    if (categoryId) {
      where.categoryId = categoryId;
    }

    // Price range
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) {
        where.price.gte = minPrice;
      }
      if (maxPrice !== undefined) {
        where.price.lte = maxPrice;
      }
    }

    // Pagination safety
    const safePage = page && page > 0 ? page : 1;
    const safePageSize =
      pageSize && pageSize > 0 && pageSize <= 100 ? pageSize : 12;

    const skip = (safePage - 1) * safePageSize;
    const take = safePageSize;

    // Sorting
    let orderBy: Prisma.ProductOrderByWithRelationInput;

    switch (sort) {
      case 'price_asc':
        orderBy = { price: 'asc' };
        break;
      case 'price_desc':
        orderBy = { price: 'desc' };
        break;
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        orderBy,
        skip,
        take,
        include: { category: true },
      }),
      this.prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(total / safePageSize);

    return {
      items,
      total,
      page: safePage,
      pageSize: safePageSize,
      totalPages,
    };
  }

  // GET /catalog/:id
  async getProductById(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  // POST /catalog
  async createProduct(dto: CreateProductDto) {
    const slug = dto.slug ? dto.slug : this.slugify(dto.name);

    return this.prisma.product.create({
      data: {
        name: dto.name,
        description: dto.description ?? null,
        price: dto.price,
        stock: dto.stock ?? 0,
        categoryId: dto.categoryId ?? null,
        slug,
        imageUrl: dto.imageUrl ?? null,
      },
    });
  }

  // PATCH /catalog/:id
  async updateProduct(id: number, dto: UpdateProductDto) {
    // Decide slug on update
    let slug = dto.slug;

    if (!slug && dto.name) {
      slug = this.slugify(dto.name);
    }

    // Build data object explicitly so TS + Prisma are happy
    const data: Prisma.ProductUpdateInput = {
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.price !== undefined && { price: dto.price }),
      ...(dto.stock !== undefined && { stock: dto.stock }),
      ...(dto.categoryId !== undefined && { category: { connect: { id: dto.categoryId } } }),
      ...(dto.imageUrl !== undefined && { imageUrl: dto.imageUrl }),
      ...(slug && { slug }),
    };

    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  // DELETE /catalog/:id
  async deleteProduct(id: number) {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
