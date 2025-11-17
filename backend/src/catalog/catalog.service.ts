import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class CatalogService {
  constructor(private prisma: PrismaService) {}

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')   // replace non-alphanumeric with dashes
      .replace(/(^-|-$)+/g, '');     // remove leading/trailing dashes
  }

  // GET /catalog
  async listProducts() {
    return this.prisma.product.findMany({
      include: { category: true },
    });
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

    // Build data object explicitly so TS is happy
    const data: any = {
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.price !== undefined && { price: dto.price }),
      ...(dto.stock !== undefined && { stock: dto.stock }),
      ...(dto.categoryId !== undefined && { categoryId: dto.categoryId }),
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
