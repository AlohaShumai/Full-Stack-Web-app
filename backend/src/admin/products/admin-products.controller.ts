import { Body, Controller, Get, Post, Patch, Delete, Param } from '@nestjs/common';
import { AdminProductsService } from './admin-products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('admin/products')
export class AdminProductsController {
  constructor(private readonly service: AdminProductsService) {}

  @Get()
  getAll() {
    return this.service.getAllProducts();
  }

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.service.createProduct(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.service.updateProduct(Number(id), dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.deleteProduct(Number(id));
  }
}
