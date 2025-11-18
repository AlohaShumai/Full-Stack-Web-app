import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetProductsQueryDto } from './dto/get-products-query.dto';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Catalog')
@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  // Public listing with filters, search, pagination
  @Get()
  listProducts(@Query() query: GetProductsQueryDto) {
    return this.catalogService.listProducts(query);
  }

  // Public product detail
  @Get(':id')
  getProduct(@Param('id', ParseIntPipe) id: number) {
    return this.catalogService.getProductById(id);
  }

  // Admin only: create product
  @Post()
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  createProduct(@Body() dto: CreateProductDto) {
    return this.catalogService.createProduct(dto);
  }

  // Admin only: update product
  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ) {
    return this.catalogService.updateProduct(id, dto);
  }

  // Admin only: delete product
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.catalogService.deleteProduct(id);
  }
}
