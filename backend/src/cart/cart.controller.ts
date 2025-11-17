import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Req,
    UseGuards,
  } from '@nestjs/common';
  import { CartService } from './cart.service';
  import { AddToCartDto } from './dto/add-to-cart.dto';
  import { UpdateCartDto } from './dto/update-cart.dto';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  
  @Controller('cart')
  @UseGuards(JwtAuthGuard)
  export class CartController {
    constructor(private readonly cartService: CartService) {}
  
    // GET /cart
    @Get()
    getCart(@Req() req: any) {
      return this.cartService.getCart(req.user.sub);
    }
  
    // POST /cart
    @Post()
    addItem(@Req() req: any, @Body() dto: AddToCartDto) {
      return this.cartService.addToCart(req.user.sub, dto);
    }
  
    // PATCH /cart/:id
    @Patch(':id')
    updateItem(
      @Req() req: any,
      @Param('id', ParseIntPipe) id: number,
      @Body() dto: UpdateCartDto,
    ) {
      return this.cartService.updateQuantity(req.user.sub, id, dto);
    }
  
    // DELETE /cart/:id
    @Delete(':id')
    removeItem(
      @Req() req: any,
      @Param('id', ParseIntPipe) id: number,
    ) {
      return this.cartService.removeItem(req.user.sub, id);
    }
  
    // DELETE /cart  -> clear entire cart
    @Delete()
    clearCart(@Req() req: any) {
      return this.cartService.clearCart(req.user.sub);
    }
  }
  